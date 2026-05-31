import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
// List of lower jaw tooth numbers for random caries assignment
const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];


const { width } = Dimensions.get('window');

export default function App() {
  // Roster Flow States: 'login' | 'signup' | 'otp' | 'app'
  const [currentFlow, setCurrentFlow] = useState('login');

  // App active tab: 'dashboard' | 'scan' | 'map' | 'patients' | 'chat' | 'settings'
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
    'http://localhost:5000/predict'
  );
  const [enableHipaaAudit, setEnableHipaaAudit] = useState(true);
  const [enableCloudSync, setEnableCloudSync] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);

  // Selected patient detailed EHR active target
  const [activePatientName, setActivePatientName] = useState('Anjali Mishra');
  const [patientSearch, setPatientSearch] = useState('');

  const [patients, setPatients] = useState(() => {
    if (Platform.OS === 'web') {
      try {
        const saved = localStorage.getItem('patients_list');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { 
        name: 'Anjali Mishra', 
        id: 'PT-49201', 
        status: 'Urgent Care', 
        badge: 'urgent', 
        desc: 'Allergies: Penicillin. Demineralization mapped mesial margin.',
        history: [
          { date: 'Today, 11:20 AM', title: 'Deep Caries Mapped — Surgical Extraction Recommended', type: 'caries' },
          { date: 'Sept 14, 2025', title: 'Prophylaxis scaler cleaning', type: 'regular' }
        ]
      },
      { 
        name: 'Ramesh Kumar', 
        id: 'PT-39185', 
        status: 'Pending', 
        badge: 'pending', 
        desc: 'Allergies: None. Follow-up scanner schedules.',
        history: [
          { date: 'Sept 10, 2025', title: 'Routine visual inspection', type: 'regular' }
        ]
      },
      { 
        name: 'Suresh Sharma', 
        id: 'PT-82903', 
        status: 'Healthy Clear', 
        badge: 'cleared', 
        desc: 'Allergies: Sulfa Drugs. Diagnostic parameters normal.',
        history: [
          { date: 'Aug 1, 2025', title: 'Comprehensive oral exam', type: 'cleared' }
        ]
      },
    ];
  });

  const [showAddPatientForm, setShowAddPatientForm] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientAllergies, setNewPatientAllergies] = useState('');
  const [newPatientStatus, setNewPatientStatus] = useState('Healthy Clear');

  useEffect(() => {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem('patients_list', JSON.stringify(patients));
      } catch (e) {
        console.error(e);
      }
    }
  }, [patients]);

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
    if (!result.cancelled) {
      // Just store the image, don't trigger scan yet
      setSelectedImage(result.uri);
      setSelectedFile(null);
      setIsScanning(false);
      setPredictionCondition('');
      setPredictionExtraction('');
      setPredictionConfidence(0);
      setScannedTooth(null);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access camera is required!');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });
    if (!result.cancelled) {
      setSelectedImage(result.uri);
      setSelectedFile(null);
      setIsScanning(false);
      setPredictionCondition('');
      setPredictionExtraction('');
      setPredictionConfidence(0);
      setScannedTooth(null);
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

  const handleSaveScanToEHR = () => {
    if (!predictionCondition) return;

    const updatedPatients = patients.map(p => {
      if (p.name === activePatientName) {
        const isCaries = predictionCondition === 'Caries Detected';
        
        const newHistoryNode = {
          date: new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }) + `, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
          title: `Scan: ${predictionCondition} — ${predictionExtraction} (${predictionConfidence.toFixed(1)}% Precision)`,
          type: isCaries ? 'caries' : 'cleared'
        };

        const currentAllergies = p.desc.split('Allergies: ')[1]?.split('.')[0] || 'None';

        return {
          ...p,
          status: isCaries ? 'Urgent Care' : 'Healthy Clear',
          badge: isCaries ? 'urgent' : 'cleared',
          desc: `Allergies: ${currentAllergies}. Last Scan: ${predictionCondition} (${predictionExtraction}) on ${new Date().toLocaleDateString()}.`,
          history: [newHistoryNode, ...p.history]
        };
      }
      return p;
    });

    setPatients(updatedPatients);
    alert(`Success: Diagnostic report saved to ${activePatientName}'s EHR timeline!`);
    setActiveTab('patients');
  };

  const handleSaveNewPatient = () => {
    if (!newPatientName.trim()) {
      alert('Please enter patient name.');
      return;
    }

    const patientId = `PT-${Math.floor(10000 + Math.random() * 90000)}`;
    const badgeType = newPatientStatus === 'Urgent Care' ? 'urgent' : newPatientStatus === 'Pending' ? 'pending' : 'cleared';
    
    const newPatientObj = {
      name: newPatientName.trim(),
      id: patientId,
      status: newPatientStatus,
      badge: badgeType,
      desc: `Allergies: ${newPatientAllergies.trim() || 'None'}. New patient profile registered.`,
      history: [
        {
          date: new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }) + `, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
          title: 'Initial Registration & EHR Profile Created',
          type: 'regular'
        }
      ]
    };

    setPatients(prev => [newPatientObj, ...prev]);
    
    // Reset Form
    setNewPatientName('');
    setNewPatientAllergies('');
    setNewPatientStatus('Healthy Clear');
    setShowAddPatientForm(false);
    
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

        // Animate progress bar up to 90% while waiting for API
        let p = 0;
        interval = setInterval(() => {
          p = Math.min(p + 10, 90);
          setScanProgress(p);
          if (p === 20) setScanStatusText('Loading image into memory...');
          if (p === 40) setScanStatusText('Extracting feature matrices...');
          if (p === 60) setScanStatusText('Running caries_model1.h5 classifier...');
          if (p === 80) setScanStatusText('Mapping demineralization regions...');
        }, 250);

        // Build FormData with the actual file bytes
        const formData = new FormData();
        if (Platform.OS === 'web') {
          const blobResponse = await fetch(uri);
          const blob = await blobResponse.blob();
          // Use a unique filename per scan so there's no OS-level caching
          const uniqueName = `xray_${Date.now()}.png`;
          formData.append('file', blob, uniqueName);
          console.log('Sending file to API, size:', blob.size, 'name:', uniqueName);
        } else {
          formData.append('file', {
            uri: uri,
            name: `xray_${Date.now()}.jpg`,
            type: 'image/jpeg',
          });
        }

        const response = await fetch(`${apiUrl}`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', JSON.stringify(data));

        clearInterval(interval);
        setScanProgress(100);
        setScanStatusText('Diagnosis complete!');

        setTimeout(() => {
          setIsScanning(false);

          if (data.error) {
            alert('Backend error: ' + data.error);
            return;
          }

          const condition = data.condition || '';
          const extraction = data.extraction || '';
          const isCaries = condition.toLowerCase().startsWith('caries');

          setPredictionCondition(isCaries ? 'Caries Detected' : 'No Caries Detected');
          setPredictionExtraction(isCaries ? 'Surgical Extraction' : 'Manual Extraction');
          setPredictionConfidence(data.confidence || 0);
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
          'Unable to connect to Flask API.\n\nError: ' + error.message +
          '\n\nCheck:\n1. Flask server running on port 5000\n2. API URL in Settings is correct\n3. CORS is enabled'
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
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.authWrapper}>
      <View style={styles.authHeader}>
        <View style={styles.logoBadge}><Text style={{ fontSize: 28 }}>🦷</Text></View>
        <Text style={styles.brandTitle}>DENTAL.AI</Text>
        <Text style={styles.brandSubtitle}>Clinical Attestation Diagnostic System</Text>
      </View>
      <View style={styles.glassCard}>
        <View style={styles.inputBox}>
          <Text style={styles.inputLbl}>Clinical License Email</Text>
          <TextInput style={styles.fieldControl} value={email} onChangeText={setEmail} placeholder="Enter clinical ID" placeholderTextColor="#64748b" />
        </View>
        <View style={styles.inputBox}>
          <Text style={styles.inputLbl}>Secure Access Password</Text>
          <TextInput style={styles.fieldControl} secureTextEntry value={password} onChangeText={setPassword} placeholder="Enter passkey" placeholderTextColor="#64748b" />
        </View>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => setCurrentFlow('app')}>
          <LinearGradient colors={['#4f46e5', '#818cf8']} style={styles.gradientBtn}>
            <Text style={styles.btnText}>Decrypt & Sign In</Text>
          </LinearGradient>
        </TouchableOpacity>
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerTxt}>Or Biometrics</Text>
          <View style={styles.dividerLine} />
        </View>
        <TouchableOpacity style={styles.biometricBtn} onPress={() => setCurrentFlow('app')}>
          <Text style={styles.biometricText}>🧬 Scan TouchID / FaceKey</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => setCurrentFlow('signup')} style={styles.footerLink}>
        <Text style={styles.footerText}>Need clinical registry? <Text style={styles.accentText}>Register License</Text></Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );

  const renderSignup = () => (
    <ScrollView contentContainerStyle={[styles.authWrapper, { paddingVertical: 40 }]}>
      <View style={styles.authHeader}>
        <View style={[styles.logoBadge, { width: 52, height: 52 }]}><Text style={{ fontSize: 22 }}>📝</Text></View>
        <Text style={[styles.brandTitle, { fontSize: 22 }]}>License Registry</Text>
        <Text style={styles.brandSubtitle}>Verify DDS credentials with central health networks</Text>
      </View>
      <View style={styles.glassCard}>
        <View style={styles.inputBox}>
          <Text style={styles.inputLbl}>Full Clinical Name</Text>
          <TextInput style={styles.fieldControl} value={doctorName} onChangeText={setDoctorName} placeholder="Dr. Samiksha Sen" placeholderTextColor="#64748b" />
        </View>
        <View style={styles.inputBox}>
          <Text style={styles.inputLbl}>Dental License No.</Text>
          <TextInput style={styles.fieldControl} value={licenseNo} onChangeText={setLicenseNo} placeholder="DDS-94031-WHO" placeholderTextColor="#64748b" />
        </View>
        <View style={styles.inputBox}>
          <Text style={styles.inputLbl}>Clinic Center Name</Text>
          <TextInput style={styles.fieldControl} value={clinicName} onChangeText={setClinicName} placeholder="Clinic Name" placeholderTextColor="#64748b" />
        </View>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => setCurrentFlow('otp')}>
          <LinearGradient colors={['#a259ff', '#6c5dd3']} style={styles.gradientBtn}>
            <Text style={styles.btnText}>Send Verification Request</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => setCurrentFlow('login')} style={styles.footerLink}>
        <Text style={styles.footerText}>Registered clinician? <Text style={styles.accentText}>Log In</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderOtp = () => (
    <View style={styles.authWrapper}>
      <View style={styles.authHeader}>
        <View style={styles.logoBadge}><Text style={{ fontSize: 26 }}>📲</Text></View>
        <Text style={styles.brandTitle}>Attestation Login</Text>
        <Text style={styles.brandSubtitle}>Dispatched 6-digit decrypt key to +91 •••• 530</Text>
      </View>
      <View style={styles.glassCard}>
        <View style={styles.otpRow}>
          {otpCodes.map((code, idx) => (
            <TextInput key={idx} style={styles.otpBox} value={code} maxLength={1} keyboardType="numeric" />
          ))}
        </View>
        <Text style={styles.otpTimer}>Resend key in <Text style={{ color: '#cbd5e1' }}>0:45</Text></Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => setCurrentFlow('app')}>
          <LinearGradient colors={['#4f46e5', '#818cf8']} style={styles.gradientBtn}>
            <Text style={styles.btnText}>Verify & Decrypt</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  // --- CORE SYSTEM VIEWPORTS ---

  // Tab 1: Dashboard
  const renderDashboard = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.portalHeader}>
        <View>
          <Text style={styles.portalTitle}>Clinical Dashboard</Text>
          <Text style={styles.portalSubtitle}>{clinicName} Center</Text>
        </View>
        <TouchableOpacity style={styles.avatarMini} onPress={() => setActiveTab('settings')}>
          <Text style={styles.avatarMiniTxt}>{doctorName.split(' ').map(n => n[0]).join('')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLbl}>Total AI Scans</Text>
          <Text style={styles.statVal}>1,482</Text>
        </View>
        <View style={[styles.statBox, { borderLeftColor: '#ef4444' }]}>
          <Text style={styles.statLbl}>Severe Caries</Text>
          <Text style={[styles.statVal, { color: '#f87171' }]}>12</Text>
        </View>
        <View style={[styles.statBox, { borderLeftColor: '#06b6d4' }]}>
          <Text style={styles.statLbl}>Avg Latency</Text>
          <Text style={[styles.statVal, { color: '#22d3ee' }]}>0.82s</Text>
        </View>
      </View>

      <View style={styles.glassCard}>
        <Text style={styles.cardTitle}>Urgent Attestations Required</Text>
        <TouchableOpacity style={styles.patientCard} onPress={() => { setActivePatientName('Anjali Mishra'); setActiveTab('patients'); }}>
          <Text style={styles.patientName}>Anjali Mishra</Text>
          <Text style={styles.patientMeta}>ID: PT-49201 | Caries Segmented (Tooth 36)</Text>
          <Text style={[styles.badgeStyle, { color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.12)' }]}>Urgent Care</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.patientCard} onPress={() => { setActivePatientName('Ramesh Kumar'); setActiveTab('patients'); }}>
          <Text style={styles.patientName}>Ramesh Kumar</Text>
          <Text style={styles.patientMeta}>ID: PT-39185 | Follow-up Roster planner</Text>
          <Text style={[styles.badgeStyle, { color: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.12)' }]}>Pending</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // Tab 2: X-Ray Scanner (Upload & Scan states)
  // Tab 2: X-Ray Scanner (Upload & Scan states)
  const renderScanXray = () => {
    if (isScanning) {
      return (
        <View style={styles.authWrapper}>
          <View style={{ width: '100%' }}>
            <Text style={styles.cardTitle}>AI Model Analysing X-Ray...</Text>
            <View style={styles.scanTrack}>
              <View style={[styles.laserBeam, { top: `${scanProgress}%` }]} />
              <Text style={styles.hologramTxt}>🦷 🦷 🦷</Text>
              <Text style={styles.percentageText}>{scanProgress}% Complete</Text>
            </View>
            <View style={styles.glassCard}>
              <ActivityIndicator size="large" color="#06b6d4" />
              <Text style={styles.statusTxt}>{scanStatusText}</Text>
            </View>
          </View>
        </View>
      );
    }

    if (predictionCondition) {
      return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.cardTitle}>AI Diagnostics Report</Text>
          <Text style={[styles.descText, { fontSize: 13, marginBottom: 16 }]}>
            Patient: <Text style={{ fontWeight: 'bold', color: '#fff' }}>{activePatientName}</Text>
          </Text>
          
          {/* Centered Image Frame */}
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={{ width: '100%', height: 240, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }} resizeMode="contain" />
            )}
            {selectedFile && (
              <Image source={{ uri: selectedFile }} style={{ width: '100%', height: 240, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }} resizeMode="contain" />
            )}
          </View>

          {/* Diagnostic results card */}
          <View style={styles.glassCard}>
            <Text style={styles.inputLbl}>AI Diagnostic Outcome</Text>
            
            <Text style={[
              styles.badgeStyle,
              {
                color: predictionCondition === 'Caries Detected' ? '#f87171' : '#10b981',
                backgroundColor: predictionCondition === 'Caries Detected' ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)',
                alignSelf: 'flex-start',
                fontSize: 14,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 10,
                marginBottom: 12,
                marginTop: 4,
              }
            ]}>
              {predictionCondition === 'Caries Detected' ? '🦷 Caries Found' : '✅ No Caries Detected'}
            </Text>

            <Text style={[styles.descText, { fontSize: 13, lineHeight: 18, marginBottom: 16 }]}>
              {predictionCondition === 'Caries Detected'
                ? "The AI model has detected demineralization layers on the crown surface. Urgent restoration or extraction is recommended."
                : "No significant demineralization or enamel erosion was detected. The tooth structural integrity is within standard parameters."}
            </Text>

            <View style={styles.dividerLine} />

            <View style={styles.statGrid}>
              {/* SVG Radial Gauge */}
              <View style={styles.radialGaugeContainer}>
                <Svg width="90" height="90" viewBox="0 0 100 100">
                  <Circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
                  <Circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke={predictionCondition === 'Caries Detected' ? "#f87171" : "#10b981"} 
                    strokeWidth="6" 
                    strokeDasharray="251" 
                    strokeDashoffset={`${251 - (251 * predictionConfidence) / 100}`} 
                    strokeLinecap="round" 
                    fill="none" 
                  />
                </Svg>
                <View style={styles.gaugeTextOverlay}>
                  <Text style={styles.gaugeValTxt}>{predictionConfidence.toFixed(1)}%</Text>
                  <Text style={styles.gaugeLblTxt}>Precision</Text>
                </View>
              </View>

              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={styles.inputLbl}>Clinical Recommendation</Text>
                <Text style={{
                  color: predictionCondition === 'Caries Detected' ? '#f87171' : '#10b981',
                  fontWeight: 'bold',
                  fontSize: 16,
                  marginTop: 2
                }}>
                  {predictionExtraction}
                </Text>
                <View style={styles.barContainer}>
                  <View style={[
                    styles.barFill,
                    {
                      width: `${predictionConfidence}%`,
                      backgroundColor: predictionCondition === 'Caries Detected' ? '#f87171' : '#10b981'
                    }
                  ]} />
                </View>
              </View>
            </View>
          </View>

          {/* Save to Patient EHR Button */}
          <TouchableOpacity 
            style={{
              height: 48,
              backgroundColor: '#10b981',
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
              shadowColor: '#10b981',
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: 6
            }} 
            onPress={handleSaveScanToEHR}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>
              💾 Save to Patient EHR
            </Text>
          </TouchableOpacity>

          {/* Reset / New Scan Button */}
          <TouchableOpacity 
            style={{
              height: 48,
              borderWidth: 1,
              borderColor: 'rgba(129, 140, 248, 0.4)',
              backgroundColor: 'rgba(129, 140, 248, 0.1)',
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
              marginBottom: 30
            }} 
            onPress={handleResetScan}
          >
            <Text style={{ color: '#818cf8', fontWeight: 'bold', fontSize: 15 }}>
              🔄 Scan Another X-Ray
            </Text>
          </TouchableOpacity>
        </ScrollView>
      );
    }

    return (
      <View style={styles.authWrapper}>
        <ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingVertical: 10 }}>
          <Text style={styles.cardTitle}>Upload Dental X-Ray for AI Analysis</Text>

          {/* Patient Selector card */}
          <View style={[styles.glassCard, { paddingVertical: 12, marginBottom: 16 }]}>
            <Text style={styles.inputLbl}>Select Patient for Scan</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
              {patients.map(p => (
                <TouchableOpacity
                  key={p.id}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 10,
                    backgroundColor: activePatientName === p.name ? '#4f46e5' : 'rgba(255,255,255,0.04)',
                    borderWidth: 1,
                    borderColor: activePatientName === p.name ? '#fff' : 'rgba(255,255,255,0.08)',
                  }}
                  onPress={() => setActivePatientName(p.name)}
                >
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: activePatientName === p.name ? 'bold' : 'normal' }}>
                    👤 {p.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* File upload dropzone */}
          <TouchableOpacity style={styles.dashedDropzone} onPress={triggerUpload}>
            <Text style={{ fontSize: 40, color: '#818cf8', marginBottom: 12 }}>☁️</Text>
            <Text style={styles.dropzoneTitle}>
              {(selectedImage || selectedFile) ? '✅ X-Ray Selected — tap to change' : 'Select X-Ray Image'}
            </Text>
            <Text style={styles.dropzoneDesc}>
              {(selectedImage || selectedFile)
                ? 'Ready to analyse. Press the button below.'
                : 'Tap here to select PNG/JPG file from your device'}
            </Text>
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={{ width: 140, height: 140, marginTop: 12, borderRadius: 8, borderWidth: 1, borderColor: '#4f46e5' }} />
            )}
            {selectedFile && (
              <Image source={{ uri: selectedFile }} style={{ width: 140, height: 140, marginTop: 12, borderRadius: 8, borderWidth: 1, borderColor: '#4f46e5' }} />
            )}
          </TouchableOpacity>

          {Platform.OS !== 'web' && (
            <TouchableOpacity
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 14,
                paddingVertical: 14,
                alignItems: 'center',
                marginBottom: 16,
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 8,
              }}
              onPress={takePhoto}
            >
              <Text style={{ fontSize: 18 }}>📸</Text>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>
                Take Live Photo of X-Ray
              </Text>
            </TouchableOpacity>
          )}

          {/* Hidden file input for web */}
          {Platform.OS === 'web' && (
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
          )}

          {/* Analyse button — only shown when an image is selected */}
          {(selectedImage || selectedFile) ? (
            <TouchableOpacity
              style={{
                backgroundColor: '#4f46e5',
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: 'center',
                marginBottom: 16,
                shadowColor: '#4f46e5',
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 8,
              }}
              onPress={startScan}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                🦷 Analyse X-Ray with AI Model
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={[styles.glassCard, { alignItems: 'center', paddingVertical: 14 }]}>
              <Text style={{ color: '#64748b', fontSize: 13 }}>
                Select an X-Ray image above to enable analysis
              </Text>
            </View>
          )}

          <View style={styles.glassCard}>
            <Text style={styles.inputLbl}>Model info</Text>
            <Text style={styles.specItem}>✓ Model: caries_model1.h5 (256×256 RGB)</Text>
            <Text style={styles.specItem}>✓ Output: Binary caries classification</Text>
            <Text style={styles.specItem}>✓ Recommendation: Surgical / Manual extraction</Text>
          </View>
        </ScrollView>
      </View>
    );
  };


  // Tab 3: Tooth prediction Map & Radial gauges
  const renderToothMap = () => {
    const rowUpper = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
    const rowLower = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.cardTitle}>Attestation Panoramic Map</Text>
        <Text style={styles.specItem}>Click molar quadrant nodes to display decay attenuation stats:</Text>

        <View style={styles.panoramicGrid}>
          {/* Upper Jaw */}
          <View style={styles.jawRow}>
            {rowUpper.map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.toothNode,
                  selectedTooth === num && styles.nodeSelected,
                ]}
                onPress={() => setSelectedTooth(num)}
              >
                <Text style={styles.nodeNum}>{num}</Text>
                <Text style={{ fontSize: 10 }}>🦷</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Lower Jaw */}
          <View style={styles.jawRow}>
            {rowLower.map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.toothNode,
                  decayedTooth === num && styles.nodeDecay,
                  selectedTooth === num && styles.nodeSelected,
                ]}
                onPress={() => setSelectedTooth(num)}
              >
                <Text style={[styles.nodeNum, num === 36 && { color: '#f87171' }]}>{num}</Text>
                <Text style={{ fontSize: 10 }}>🦷</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Diagnostic analysis result cards */}
        <View style={styles.glassCard}>
          <Text style={styles.cardTitle}>🦷 Molar Tooth {selectedTooth} Diagnosis</Text>
          {selectedTooth === scannedTooth && predictionCondition ? (
            <View>
              <Text style={[
                styles.badgeStyle,
                {
                  color: predictionCondition === 'Caries Detected' ? '#f87171' : '#10b981',
                  backgroundColor: predictionCondition === 'Caries Detected' ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)',
                  alignSelf: 'flex-start'
                }
              ]}>
                {predictionCondition}
              </Text>
              <Text style={[styles.descText, { marginTop: 8 }]}>
                {predictionCondition === 'Caries Detected'
                  ? "Caries found, go for surgical extraction."
                  : "No caries detected, go for manual extraction."}
              </Text>

              <View style={styles.statGrid}>
                {/* SVG Radial Gauge */}
                <View style={styles.radialGaugeContainer}>
                  <Svg width="100" height="100" viewBox="0 0 100 100">
                    <Circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
                    <Circle cx="50" cy="50" r="40" stroke={predictionCondition === 'Caries Detected' ? "#f87171" : "#10b981"} strokeWidth="6" strokeDasharray="251" strokeDashoffset={`${251 - (251 * predictionConfidence) / 100}`} strokeLinecap="round" fill="none" />
                  </Svg>
                  <View style={styles.gaugeTextOverlay}>
                    <Text style={styles.gaugeValTxt}>{predictionConfidence.toFixed(1)}%</Text>
                    <Text style={styles.gaugeLblTxt}>Precision</Text>
                  </View>
                </View>

                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={styles.inputLbl}>Extraction recommendation</Text>
                  <Text style={{
                    color: predictionCondition === 'Caries Detected' ? '#f87171' : '#10b981',
                    fontWeight: 'bold',
                    fontSize: 15
                  }}>
                    {predictionExtraction}
                  </Text>
                  <View style={styles.barContainer}>
                    <View style={[
                      styles.barFill,
                      {
                        width: `${predictionConfidence}%`,
                        backgroundColor: predictionCondition === 'Caries Detected' ? '#f87171' : '#10b981'
                      }
                    ]} />
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View>
              <Text style={[styles.badgeStyle, { color: '#10b981', alignSelf: 'flex-start' }]}>
                Healthy Clear
              </Text>
              <Text style={styles.descText}>
                Tissue density structures fall in standard parameters. Root stability confirmed.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    );
  };

  // Tab 4: Patients & EHR profile view
  const renderPatients = () => {
    const filtered = patients.filter(p => p.name.toLowerCase().includes(patientSearch.toLowerCase()));

    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.cardTitle}>Patient Directory database</Text>
        <TextInput
          style={styles.fieldControl}
          placeholder="Search by patient name or diagnosis..."
          placeholderTextColor="#64748b"
          value={patientSearch}
          onChangeText={setPatientSearch}
        />

        <TouchableOpacity 
          style={{
            backgroundColor: showAddPatientForm ? '#ef4444' : '#4f46e5',
            borderRadius: 12,
            paddingVertical: 12,
            paddingHorizontal: 16,
            alignItems: 'center',
            marginTop: 12,
            marginBottom: 16,
          }}
          onPress={() => setShowAddPatientForm(!showAddPatientForm)}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>
            {showAddPatientForm ? '✕ Close Form' : '➕ Add New Patient'}
          </Text>
        </TouchableOpacity>

        {showAddPatientForm && (
          <View style={styles.glassCard}>
            <Text style={[styles.cardTitle, { marginBottom: 16 }]}>Register New Patient</Text>
            
            <View style={styles.inputBox}>
              <Text style={styles.inputLbl}>Patient Full Name</Text>
              <TextInput 
                style={styles.fieldControl} 
                value={newPatientName} 
                onChangeText={setNewPatientName} 
                placeholder="Enter full name" 
                placeholderTextColor="#64748b" 
              />
            </View>

            <View style={styles.inputBox}>
              <Text style={styles.inputLbl}>Allergies / Special Notes</Text>
              <TextInput 
                style={styles.fieldControl} 
                value={newPatientAllergies} 
                onChangeText={setNewPatientAllergies} 
                placeholder="e.g. Penicillin, Sulfa Drugs, None" 
                placeholderTextColor="#64748b" 
              />
            </View>

            <View style={styles.inputBox}>
              <Text style={styles.inputLbl}>Initial Diagnosis Status</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                {['Healthy Clear', 'Pending', 'Urgent Care'].map(status => {
                  const isSel = newPatientStatus === status;
                  return (
                    <TouchableOpacity
                      key={status}
                      style={{
                        flex: 1,
                        paddingVertical: 10,
                        borderRadius: 10,
                        backgroundColor: isSel ? '#4f46e5' : 'rgba(255,255,255,0.04)',
                        borderWidth: 1,
                        borderColor: isSel ? '#fff' : 'rgba(255,255,255,0.08)',
                        alignItems: 'center',
                      }}
                      onPress={() => setNewPatientStatus(status)}
                    >
                      <Text style={{ color: '#fff', fontSize: 11, fontWeight: isSel ? 'bold' : 'normal' }}>
                        {status}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={handleSaveNewPatient}>
              <LinearGradient colors={['#10b981', '#059669']} style={styles.gradientBtn}>
                <Text style={styles.btnText}>Save Patient Profile</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ marginTop: 16 }}>
          {filtered.map((p, idx) => (
            <TouchableOpacity key={idx} style={styles.patientCard} onPress={() => setActivePatientName(p.name)}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.patientName}>{p.name}</Text>
                <Text style={[
                  styles.badgeStyle,
                  p.badge === 'urgent' && { color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.12)' },
                  p.badge === 'pending' && { color: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.12)' },
                  p.badge === 'cleared' && { color: '#10b981', backgroundColor: 'rgba(16,185,129,0.12)' }
                ]}>{p.status}</Text>
              </View>
              <Text style={styles.patientMeta}>Patient ID: {p.id}</Text>

              {activePatientName === p.name && (
                <View style={styles.ehrTimelineWrapper}>
                  <Text style={styles.inputLbl}>EHR Diagnostic details</Text>
                  <Text style={styles.descText}>{p.desc}</Text>

                  {p.history && p.history.map((h, hidx) => (
                    <View key={hidx} style={[styles.timelineNode, hidx === p.history.length - 1 && { paddingBottom: 0 }]}>
                      <View style={[
                        styles.nodeTimePoint, 
                        { backgroundColor: h.type === 'caries' ? '#ef4444' : '#10b981' }
                      ]} />
                      <Text style={{ fontSize: 10, color: '#64748b' }}>{h.date}</Text>
                      <Text style={styles.patientName}>{h.title}</Text>
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  };

  // Tab 5: AI Diagnostics Chat companion
  const renderChatCompanion = () => (
    <View style={styles.chatWrapper}>
      <Text style={styles.cardTitle}>AI Clinical Diagnostics Assistant</Text>
      <ScrollView
        style={{ width: '100%', flex: 1, marginVertical: 12 }}
        contentContainerStyle={{ paddingBottom: 12 }}
      >
        {chatMessages.map((msg, idx) => (
          <View
            key={idx}
            style={[
              styles.speechBubble,
              msg.sender === 'user' ? styles.bubbleUser : styles.bubbleBot
            ]}
          >
            <Text style={styles.speechTxt}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.trayFooter}>
        <TextInput
          style={styles.trayInput}
          placeholder="Ask about tooth 36..."
          placeholderTextColor="#64748b"
          value={chatInput}
          onChangeText={setChatInput}
        />
        <TouchableOpacity style={styles.sendTrigger} onPress={handleChatSend}>
          <Text style={{ color: '#fff', fontSize: 16 }}>➔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Tab 6: Settings config
  const renderSettingsConfig = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.cardTitle}>Clinic System Settings</Text>

      <View style={styles.glassCard}>
        <Text style={styles.inputLbl}>Clinical Audit Options</Text>
        <View style={styles.switchRow}>
          <Text style={styles.descText}>HIPAA Compliant Logging</Text>
          <Switch value={enableHipaaAudit} onValueChange={setEnableHipaaAudit} />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.descText}>Secure Cloud Sync rosters</Text>
          <Switch value={enableCloudSync} onValueChange={setEnableCloudSync} />
        </View>
      </View>

      <View style={styles.glassCard}>
        <Text style={styles.inputLbl}>Keras API Endpoint URL</Text>
        <TextInput style={styles.fieldControl} value={apiUrl} onChangeText={setApiUrl} />
      </View>

      <View style={styles.glassCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.inputLbl}>Model classifier sensitivity</Text>
          <Text style={{ color: '#22d3ee', fontWeight: 'bold' }}>{confidenceThreshold}%</Text>
        </View>

        <View style={styles.sliderTrack}>
          <TouchableOpacity style={[styles.knob, { left: `${(confidenceThreshold - 50) * 2}%` }]} />
        </View>

        <View style={{ flexDirection: 'row', gap: 6, marginTop: 10 }}>
          <TouchableOpacity style={styles.btnSmall} onPress={() => setConfidenceThreshold(75)}>
            <Text style={styles.btnSmallTxt}>75% Low</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSmall} onPress={() => setConfidenceThreshold(85)}>
            <Text style={styles.btnSmallTxt}>85% Normal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSmall} onPress={() => setConfidenceThreshold(95)}>
            <Text style={styles.btnSmallTxt}>95% High</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={() => { setCurrentFlow('login'); setActiveTab('dashboard'); }}>
        <Text style={styles.logoutTxt}>Sign Out Doctor License</Text>
      </TouchableOpacity>
    </ScrollView>
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
      <LinearGradient colors={['#090d16', '#020617']} style={styles.gradientBg} />

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
          <View style={styles.bottomTabTray}>
            <TouchableOpacity style={styles.tabNode} onPress={() => setActiveTab('dashboard')}>
              <Text style={[styles.tabIcon, activeTab === 'dashboard' && styles.tabActiveText]}>📊</Text>
              <Text style={[styles.tabLbl, activeTab === 'dashboard' && styles.tabActiveText]}>Dash</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabNode} onPress={() => setActiveTab('scan')}>
              <Text style={[styles.tabIcon, activeTab === 'scan' && styles.tabActiveText]}>☁️</Text>
              <Text style={[styles.tabLbl, activeTab === 'scan' && styles.tabActiveText]}>Scan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabNode} onPress={() => setActiveTab('patients')}>
              <Text style={[styles.tabIcon, activeTab === 'patients' && styles.tabActiveText]}>👥</Text>
              <Text style={[styles.tabLbl, activeTab === 'patients' && styles.tabActiveText]}>Patients</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabNode} onPress={() => setActiveTab('chat')}>
              <Text style={[styles.tabIcon, activeTab === 'chat' && styles.tabActiveText]}>💬</Text>
              <Text style={[styles.tabLbl, activeTab === 'chat' && styles.tabActiveText]}>AI Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabNode} onPress={() => setActiveTab('settings')}>
              <Text style={[styles.tabIcon, activeTab === 'settings' && styles.tabActiveText]}>⚙️</Text>
              <Text style={[styles.tabLbl, activeTab === 'settings' && styles.tabActiveText]}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090d16',
  },
  gradientBg: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  // Auth Layouts
  authWrapper: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  authHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#4f46e5',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  brandSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 6,
  },
  glassCard: {
    backgroundColor: 'rgba(20, 26, 46, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  inputBox: {
    marginBottom: 16,
  },
  inputLbl: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#94a3b8',
    marginBottom: 6,
  },
  fieldControl: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 14,
  },
  primaryBtn: {
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  gradientBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  dividerTxt: {
    color: '#64748b',
    fontSize: 11,
    marginHorizontal: 10,
    textTransform: 'uppercase',
  },
  biometricBtn: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  biometricText: {
    color: '#fff',
    fontSize: 14,
  },
  footerLink: {
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 13,
  },
  accentText: {
    color: '#818cf8',
    fontWeight: 'bold',
  },
  // OTP Verification
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  otpBox: {
    width: 44,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  otpTimer: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 13,
    marginBottom: 20,
  },
  // Portal Layouts
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Space for bottom tabs
  },
  portalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  portalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  portalSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  avatarMini: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMiniTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  // Stats Grids
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(20, 26, 46, 0.6)',
    borderLeftWidth: 4,
    borderLeftColor: '#4f46e5',
    borderRadius: 12,
    padding: 12,
  },
  statLbl: {
    fontSize: 9,
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  statVal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  patientCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  patientName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#fff',
  },
  patientMeta: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  badgeStyle: {
    fontSize: 9,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 6,
    textTransform: 'uppercase',
  },
  // X-Ray Scanner
  dashedDropzone: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    minHeight: 200,
  },
  dropzoneTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  dropzoneDesc: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  specItem: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 6,
    lineHeight: 16,
  },
  scanTrack: {
    width: '100%',
    height: 200,
    backgroundColor: '#04070e',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20,
  },
  laserBeam: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#06b6d4',
  },
  hologramTxt: {
    fontSize: 48,
    opacity: 0.12,
  },
  percentageText: {
    position: 'absolute',
    bottom: 12,
    color: '#22d3ee',
    fontSize: 13,
    fontWeight: 'bold',
  },
  statusTxt: {
    color: '#94a3b8',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  // Tooth Panoramic jaw grid
  panoramicGrid: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
  },
  jawRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  toothNode: {
    flex: 1,
    aspectRatio: 0.75,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 1,
  },
  nodeDecay: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#ef4444',
  },
  nodeSelected: {
    backgroundColor: '#4f46e5',
    borderColor: '#fff',
  },
  nodeNum: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#94a3b8',
  },
  descText: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 16,
  },
  statGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 14,
  },
  radialGaugeContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeTextOverlay: {
    position: 'absolute',
    alignItems: 'center',
  },
  gaugeValTxt: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  gaugeLblTxt: {
    fontSize: 8,
    color: '#22d3ee',
    fontWeight: 'bold',
  },
  barContainer: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    marginTop: 8,
    overflow: 'hidden',
  },
  barFill: {
    width: '82%',
    height: '100%',
    backgroundColor: '#ef4444',
    borderRadius: 10,
  },
  // EHR timeline
  ehrTimelineWrapper: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  timelineNode: {
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(255,255,255,0.08)',
    paddingLeft: 16,
    marginLeft: 8,
    position: 'relative',
    paddingBottom: 16,
    marginTop: 10,
  },
  nodeTimePoint: {
    position: 'absolute',
    left: -5,
    top: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  // AI chatbot layouts
  chatWrapper: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
  },
  speechBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  bubbleBot: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderBottomLeftRadius: 2,
    alignSelf: 'flex-start',
  },
  bubbleUser: {
    backgroundColor: '#4f46e5',
    borderBottomRightRadius: 2,
    alignSelf: 'flex-end',
  },
  speechTxt: {
    color: '#fff',
    fontSize: 13,
    lineHeight: 16,
  },
  trayFooter: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  trayInput: {
    flex: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 13,
  },
  sendTrigger: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Clinic Settings switch configs
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  sliderTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    marginVertical: 14,
    position: 'relative',
  },
  knob: {
    position: 'absolute',
    top: -5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#06b6d4',
  },
  btnSmall: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSmallTxt: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  logoutBtn: {
    height: 46,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  logoutTxt: {
    color: '#f87171',
    fontWeight: 'bold',
    fontSize: 13,
  },
  // Bottom Tab Navigator Layouts
  bottomTabTray: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#0f1322',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 12 : 0,
  },
  tabNode: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabIcon: {
    fontSize: 18,
    color: '#64748b',
  },
  tabLbl: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '600',
  },
  tabActiveText: {
    color: '#818cf8',
  },
});
