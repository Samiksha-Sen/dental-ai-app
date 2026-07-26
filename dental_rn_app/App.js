import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from './src/services/supabaseClient';
import * as authService from './src/services/authService';
import * as storageService from './src/services/storageService';
import * as scanService from './src/services/scanService';
import * as databaseService from './src/services/databaseService';
import { predictXray } from './src/services/predictApi';
import Splash from './src/screens/Splash';
import Login from './src/screens/auth/Login';
import Signup from './src/screens/auth/Signup';
import Otp from './src/screens/auth/Otp';
import TabBar from './src/components/TabBar';
import Dashboard from './src/screens/Dashboard';
import Scan from './src/screens/Scan';
import Patients from './src/screens/Patients';
import Chat from './src/screens/Chat';
import Settings from './src/screens/Settings';
import { colors, gradients } from './src/theme/tokens';

// Formats a Postgres timestamptz the same way the old hardcoded demo data read
const formatHistoryDate = (isoString) => {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    `, ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
};

export default function App() {
  // Roster Flow States: 'splash' | 'login' | 'signup' | 'otp' | 'app'
  const [currentFlow, setCurrentFlow] = useState('splash');

  // App active tab: 'dashboard' | 'scan' | 'patients' | 'chat' | 'settings'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Form / Credentials States
  const [email, setEmail] = useState('dr.samiksha@dentistry.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [doctorName, setDoctorName] = useState('Dr. Samiksha Sen');
  const [licenseNo, setLicenseNo] = useState('DDS-94031-WHO');
  const [clinicName, setClinicName] = useState('Apex Dental Diagnostics');
  const [otpCodes, setOtpCodes] = useState(['7', '4', '0', '9', '3', '2']);

  // Clinic Parameters
  const [apiUrl, setApiUrl] = useState(
    Platform.OS === 'web' ? 'http://localhost:5000/predict' : 'http://172.23.50.25:5000/predict'
  );
  const [enableHipaaAudit, setEnableHipaaAudit] = useState(true);
  const [enableCloudSync, setEnableCloudSync] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);

  // Selected patient detailed EHR active target
  const [activePatientName, setActivePatientName] = useState('Anjali Mishra');
  const [patientSearch, setPatientSearch] = useState('');

  const [patients, setPatients] = useState([]);
  const [patientsLoaded, setPatientsLoaded] = useState(false);
  const [patientsError, setPatientsError] = useState(null);

  const [scanHistory, setScanHistory] = useState([]);
  const [loadingScans, setLoadingScans] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const loadPatients = async () => {
    const { data, error } = await databaseService.getPatients();

    if (error) {
      console.error('Failed to load patients from Supabase', error);
      setPatientsError(error.message);
      setPatientsLoaded(true);
      return;
    }

    const mapped = (data || []).map(p => ({
      dbId: p.id,
      id: p.patient_code,
      name: p.name,
      status: p.status,
      badge: p.badge,
      desc: p.description,
      history: [...(p.patient_history || [])]
        .sort((a, b) => new Date(b.event_date) - new Date(a.event_date))
        .map(h => ({ date: formatHistoryDate(h.event_date), title: h.title, type: h.type }))
    }));

    setPatients(mapped);
    setPatientsError(null);
    setPatientsLoaded(true);
  };

  const loadScanHistory = async () => {
    try {
      setLoadingScans(true);
      const { user } = await authService.getCurrentUser();
      const { data, error } = await scanService.getScansByUser(user?.id || null);
      if (!error && data) {
        setScanHistory(data);
      }
    } catch (e) {
      console.warn('Error fetching scan history:', e.message);
    } finally {
      setLoadingScans(false);
    }
  };

  useEffect(() => {
    loadPatients();
    loadScanHistory();

    // Restore persistent session & subscribe to auth changes
    authService.getSession().then(({ session }) => {
      if (session?.user) {
        console.log('Persistent session active for user:', session.user.email);
      }
    });

    const subscription = authService.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        loadScanHistory();
      }
    });

    return () => {
      subscription?.unsubscribe?.();
    };
  }, []);

  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientAllergies, setNewPatientAllergies] = useState('');
  const [newPatientStatus, setNewPatientStatus] = useState('Healthy Clear');

  // Interactive Dental Diagnostics States
  const [selectedTooth, setSelectedTooth] = useState(36);
  const [decayedTooth, setDecayedTooth] = useState(null);
  const [predictionConfidence, setPredictionConfidence] = useState(0);
  const [predictionCondition, setPredictionCondition] = useState("");
  const [predictionExtraction, setPredictionExtraction] = useState("");
  const [scannedTooth, setScannedTooth] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert('Permission to access media library is required!');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Just store the image, don't trigger scan yet
        setSelectedImage(result.assets[0].uri);
        setSelectedFile(null);
        setIsScanning(false);
        setPredictionCondition('');
        setPredictionExtraction('');
        setPredictionConfidence(0);
        setScannedTooth(null);
      }
    } catch (e) {
      alert('Failed to pick image: ' + e.message);
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        alert('Permission to access camera is required!');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
        setSelectedFile(null);
        setIsScanning(false);
        setPredictionCondition('');
        setPredictionExtraction('');
        setPredictionConfidence(0);
        setScannedTooth(null);
      }
    } catch (e) {
      alert('Failed to take photo: ' + e.message);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const uri = URL.createObjectURL(file);
      // Just store the file URI, don't trigger scan yet
      setSelectedFile(uri);
      setSelectedImage(null);
      setIsScanning(false);
      setPredictionCondition('');
      setPredictionExtraction('');
      setPredictionConfidence(0);
      setScannedTooth(null);
    }
  };

  const triggerUpload = () => {
    if (Platform.OS === 'web') {
      fileInputRef.current && fileInputRef.current.click();
    } else {
      pickImage();
    }
  };

  // Triggered explicitly by the user clicking "Analyse X-Ray"
  const startScan = () => {
    const uri = selectedImage || selectedFile;
    if (!uri) {
      alert('Please select an X-Ray image first.');
      return;
    }
    setScanProgress(0);
    setScanStatusText('Initializing neural network...');
    setIsScanning(true);
  };

  const handleResetScan = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setPredictionCondition('');
    setPredictionExtraction('');
    setPredictionConfidence(0);
    setScannedTooth(null);
  };

  const handleSaveScanToEHR = async () => {
    if (!predictionCondition) return;

    const target = patients.find(p => p.name === activePatientName);
    if (!target) return;

    const isCaries = predictionCondition === 'Caries Detected';
    const historyTitle = `Scan: ${predictionCondition} — ${predictionExtraction} (${predictionConfidence.toFixed(1)}% Precision)`;
    const historyType = isCaries ? 'caries' : 'cleared';
    const currentAllergies = target.desc.split('Allergies: ')[1]?.split('.')[0] || 'None';
    const newStatus = isCaries ? 'Urgent Care' : 'Healthy Clear';
    const newBadge = isCaries ? 'urgent' : 'cleared';
    const newDesc = `Allergies: ${currentAllergies}. Last Scan: ${predictionCondition} (${predictionExtraction}) on ${new Date().toLocaleDateString()}.`;

    const [{ data: historyRow, error: historyError }, { error: updateError }] = await Promise.all([
      databaseService.addPatientHistory({
        patient_id: target.dbId,
        title: historyTitle,
        type: historyType,
      }),
      databaseService.updatePatientStatus(target.dbId, {
        status: newStatus,
        badge: newBadge,
        description: newDesc,
      }),
    ]);

    if (historyError || updateError) {
      console.error('Failed to save scan to Supabase', historyError || updateError);
      alert(`Error: Failed to save diagnostic report — ${(historyError || updateError).message}`);
      return;
    }

    const newHistoryNode = { date: formatHistoryDate(historyRow.event_date), title: historyRow.title, type: historyRow.type };
    setPatients(prev => prev.map(p => (
      p.dbId === target.dbId
        ? { ...p, status: newStatus, badge: newBadge, desc: newDesc, history: [newHistoryNode, ...p.history] }
        : p
    )));
    alert(`Success: Diagnostic report saved to ${activePatientName}'s EHR timeline!`);
    setActiveTab('patients');
  };

  const handleSaveNewPatient = async () => {
    if (!newPatientName.trim()) {
      alert('Please enter patient name.');
      return;
    }

    const patientId = `PT-${Math.floor(10000 + Math.random() * 90000)}`;
    const badgeType = newPatientStatus === 'Urgent Care' ? 'urgent' : newPatientStatus === 'Pending' ? 'pending' : 'cleared';
    const description = `Allergies: ${newPatientAllergies.trim() || 'None'}. New patient profile registered.`;

    const { data: insertedPatient, error: insertError } = await databaseService.createPatient({
      patient_code: patientId,
      name: newPatientName.trim(),
      status: newPatientStatus,
      badge: badgeType,
      description,
    });

    if (insertError) {
      console.error('Failed to register patient in Supabase', insertError);
      alert(`Error: Failed to register patient — ${insertError.message}`);
      return;
    }

    const { data: historyRow, error: historyError } = await databaseService.addPatientHistory({
      patient_id: insertedPatient.id,
      title: 'Initial Registration & EHR Profile Created',
      type: 'regular',
    });

    if (historyError) {
      console.error('Failed to record initial history entry in Supabase', historyError);
    }

    const newPatientObj = {
      dbId: insertedPatient.id,
      id: insertedPatient.patient_code,
      name: insertedPatient.name,
      status: insertedPatient.status,
      badge: insertedPatient.badge,
      desc: insertedPatient.description,
      history: historyRow
        ? [{ date: formatHistoryDate(historyRow.event_date), title: historyRow.title, type: historyRow.type }]
        : []
    };

    setPatients(prev => [newPatientObj, ...prev]);

    // Reset Form
    setNewPatientName('');
    setNewPatientAllergies('');
    setNewPatientStatus('Healthy Clear');

    alert(`Success: Registered patient ${newPatientName.trim()} with ID ${patientId}!`);
  };

  const [scanStatusText, setScanStatusText] = useState('Initializing neural network...');

  // Chat conversation
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello, Dr. Samiksha. I can describe tooth pathology or treatment alternatives for Tooth 36.' }
  ]);

  // Handle scanning: fires when isScanning flips to true
  useEffect(() => {
    if (!isScanning) return;

    let interval;

    const performScan = async () => {
      try {
        // Capture the URI at the time the scan starts
        const uri = selectedImage || selectedFile;
        if (!uri) {
          throw new Error('No image selected');
        }

        console.log('Starting scan with URI:', uri);

        // Get current authenticated user ID (fallback to anonymous ID if unauthenticated)
        const { user: currentUser } = await authService.getCurrentUser();
        const currentUserId = currentUser?.id || '00000000-0000-0000-0000-000000000000';

        // Animate progress bar up to 90% while waiting for API & Supabase operations
        let p = 0;
        interval = setInterval(() => {
          p = Math.min(p + 10, 90);
          setScanProgress(p);
          if (p === 20) setScanStatusText('Uploading image to Supabase Storage...');
          if (p === 40) setScanStatusText('Saving initial scan record to database...');
          if (p === 60) setScanStatusText('Running caries_model1.h5 classifier...');
          if (p === 80) setScanStatusText('Updating scan record in Supabase...');
        }, 250);

        // 1) Upload image to Supabase Storage bucket ('dental-xrays') under user-id/image-name.png
        const fileName = `xray_${Date.now()}.png`;
        const { publicUrl, error: uploadErr } = await storageService.uploadXray(uri, currentUserId, fileName);
        if (uploadErr) {
          console.warn('Supabase storage upload notice:', uploadErr.message);
        }
        const storageUrl = publicUrl || uri;

        // 2) Save the URL in the scans table with status 'processing'
        const { data: scanRow, error: insertScanErr } = await scanService.createScanRecord({
          userId: currentUser?.id || null,
          imageUrl: storageUrl,
          status: 'processing',
        });
        if (insertScanErr) {
          console.warn('Supabase scans insert notice:', insertScanErr.message);
        }
        const createdScanId = scanRow?.id;

        // 3) Call existing Flask AI API (DO NOT MODIFY AI PREDICTION LOGIC)
        const data = await predictXray(uri, apiUrl, confidenceThreshold / 100);

        // 4) After Flask AI API returns: automatically update the corresponding scan record
        const condition = data.condition || '';
        const extraction = data.extraction || '';
        const isCaries = condition.toLowerCase().startsWith('caries');
        const finalPrediction = isCaries ? 'Caries Detected' : 'No Caries Detected';
        const finalConfidence = Number(data.confidence || 0);

        if (createdScanId) {
          const { error: updateScanErr } = await scanService.updateScanPrediction(createdScanId, {
            prediction: finalPrediction,
            confidence: finalConfidence,
            status: 'completed',
          });
          if (updateScanErr) {
            console.warn('Supabase scans update notice:', updateScanErr.message);
          }

          // Save report to reports table
          await databaseService.createReport({
            scan_id: createdScanId,
            severity: isCaries ? 'high' : 'normal',
            recommendation: extraction || 'Routine clinical monitoring',
          });
        }

        // Reload scan history
        loadScanHistory();

        clearInterval(interval);
        setScanProgress(100);
        setScanStatusText('Diagnosis complete!');

        setTimeout(() => {
          setIsScanning(false);

          if (data.error) {
            alert(data.error);
            return;
          }

          setPredictionCondition(finalPrediction);
          setPredictionExtraction(extraction);
          setPredictionConfidence(finalConfidence);
          setScannedTooth(selectedTooth);
          setDecayedTooth(isCaries ? selectedTooth : null);
        }, 800);

      } catch (error) {
        console.log('Scan error:', error.message);
        clearInterval(interval);
        setIsScanning(false);
        setPredictionConfidence(0);
        setPredictionCondition('');
        setPredictionExtraction('');
        setScannedTooth(null);
        setDecayedTooth(null);
        alert(
          'Scan failed.\n\nError: ' + error.message
        );
      }
    };

    performScan();

    return () => clearInterval(interval);
  }, [isScanning]);

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      let reply = "I've analyzed the clinical datasets for your query. Could you specify which lower teeth quadrant details you would like?";
      const q = userMsg.toLowerCase();
      if (q.includes('36') || q.includes('tooth 36')) {
        reply = "Tooth 36 displays deep enamel decay on its mesial margin. Model confidence is 94.7%. The surgical extraction risk index is 82% due to proximal nerve decay threat.";
      } else if (q.includes('caries') || q.includes('decay')) {
        reply = "Dental AI (caries_model1.h5) segmentations isolate enamel attenuation densities to map demineralization margins. Sensitivity values can be configured in your settings.";
      } else if (q.includes('extraction')) {
        reply = "Surgical extraction is indicated when caries compromise crown structure. Root Canal Therapy (RCT) with pulp capping remains a conservative alternate.";
      }
      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 750);
  };

  // --- RENDERS FOR AUTHENTICATION FLOWS ---

  const renderLogin = () => (
    <Login
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      onSubmit={async () => {
        try {
          setAuthLoading(true);
          const { error } = await authService.signIn(email, password);
          if (error) {
            console.warn('Supabase sign in notice:', error.message);
          }
        } catch (e) {
          console.warn('Login attempt notice:', e.message);
        } finally {
          setAuthLoading(false);
          setCurrentFlow('app');
        }
      }}
      onGotoSignup={() => setCurrentFlow('signup')}
    />
  );

  const renderSignup = () => (
    <Signup
      doctorName={doctorName}
      setDoctorName={setDoctorName}
      licenseNo={licenseNo}
      setLicenseNo={setLicenseNo}
      clinicName={clinicName}
      setClinicName={setClinicName}
      onSubmit={async () => {
        try {
          setAuthLoading(true);
          const { error } = await authService.signUp(email, 'DefaultSecurePass!123', doctorName);
          if (error) {
            console.warn('Supabase sign up notice:', error.message);
          }
        } catch (e) {
          console.warn('Signup attempt notice:', e.message);
        } finally {
          setAuthLoading(false);
          setCurrentFlow('otp');
        }
      }}
      onGotoLogin={() => setCurrentFlow('login')}
    />
  );

  const renderOtp = () => (
    <Otp otpCodes={otpCodes} onSubmit={() => setCurrentFlow('app')} />
  );

  // --- CORE SYSTEM VIEWPORTS ---

  // Tab 1: Dashboard
  const renderDashboard = () => (
    <Dashboard
      clinicName={clinicName}
      doctorName={doctorName}
      onSelectPatient={(name) => { setActivePatientName(name); setActiveTab('patients'); }}
      onGotoTab={(tab) => setActiveTab(tab)}
      onGotoSettings={() => setActiveTab('settings')}
    />
  );

  // Tab 2: X-Ray Scanner (Upload & Scan states)
  // Tab 2: X-Ray Scanner (Upload & Scan states)
  const renderScanXray = () => (
    <Scan
      isScanning={isScanning}
      scanProgress={scanProgress}
      scanStatusText={scanStatusText}
      predictionCondition={predictionCondition}
      predictionExtraction={predictionExtraction}
      predictionConfidence={predictionConfidence}
      activePatientName={activePatientName}
      selectedImage={selectedImage}
      selectedFile={selectedFile}
      patients={patients}
      setActivePatientName={setActivePatientName}
      triggerUpload={triggerUpload}
      takePhoto={takePhoto}
      fileInputRef={fileInputRef}
      handleFileSelect={handleFileSelect}
      startScan={startScan}
      handleSaveScanToEHR={handleSaveScanToEHR}
      handleResetScan={handleResetScan}
    />
  );




  // Tab 4: Patients & EHR profile view
  const renderPatients = () => (
    <Patients
      patients={patients}
      patientSearch={patientSearch}
      setPatientSearch={setPatientSearch}
      patientsLoaded={patientsLoaded}
      patientsError={patientsError}
      activePatientName={activePatientName}
      setActivePatientName={setActivePatientName}
      newPatientName={newPatientName}
      setNewPatientName={setNewPatientName}
      newPatientAllergies={newPatientAllergies}
      setNewPatientAllergies={setNewPatientAllergies}
      newPatientStatus={newPatientStatus}
      setNewPatientStatus={setNewPatientStatus}
      handleSaveNewPatient={handleSaveNewPatient}
    />
  );

  // Tab 5: AI Diagnostics Chat companion
  const renderChatCompanion = () => (
    <Chat
      chatMessages={chatMessages}
      chatInput={chatInput}
      setChatInput={setChatInput}
      handleChatSend={handleChatSend}
    />
  );

  // Tab 6: Settings config
  const renderSettingsConfig = () => (
    <Settings
      enableHipaaAudit={enableHipaaAudit}
      setEnableHipaaAudit={setEnableHipaaAudit}
      enableCloudSync={enableCloudSync}
      setEnableCloudSync={setEnableCloudSync}
      apiUrl={apiUrl}
      setApiUrl={setApiUrl}
      confidenceThreshold={confidenceThreshold}
      setConfidenceThreshold={setConfidenceThreshold}
      onSignOut={async () => {
        await authService.signOut();
        setCurrentFlow('login');
        setActiveTab('dashboard');
      }}
    />
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'scan': return renderScanXray();
      case 'patients': return renderPatients();
      case 'chat': return renderChatCompanion();
      case 'settings': return renderSettingsConfig();
      default: return renderDashboard();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={gradients.bg} style={styles.gradientBg} />

      {currentFlow === 'splash' && <Splash onDone={() => setCurrentFlow('login')} />}
      {currentFlow === 'login' && renderLogin()}
      {currentFlow === 'signup' && renderSignup()}
      {currentFlow === 'otp' && renderOtp()}

      {currentFlow === 'app' && (
        <View style={{ flex: 1 }}>
          {/* Main workspace frame viewport */}
          <View style={{ flex: 1 }}>
            {renderActiveTab()}
          </View>

          {/* Clean clinical production Bottom Tab Navigator */}
          <TabBar activeTab={activeTab} onChange={setActiveTab} />
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  gradientBg: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
