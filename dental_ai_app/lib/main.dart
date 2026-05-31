import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'services/api_service.dart';


void main() {
  runApp(const DentalApp());
}

class DentalApp extends StatelessWidget {
  const DentalApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Dental AI',
      theme: ThemeData(
        primarySwatch: Colors.teal,
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  XFile? _image;
  String result = "Upload X-ray to analyze";
  bool loading = false;

  final ImagePicker picker = ImagePicker();

  // 📁 Pick Image (Gallery / Camera)
  Future<void> pickImage(ImageSource source) async {
    final picked = await picker.pickImage(source: source);

    if (picked != null) {
      setState(() {
        _image = picked;
        result = "Ready to analyze";
      });
    }
  }

  // 🤖 Analyze Image
  Future<void> analyzeImage() async {
    if (_image == null) return;

    setState(() {
      loading = true;
    });

    try {
      var response = await ApiService.uploadImage(_image!.path);

      setState(() {
        result =
            "Condition: ${response['condition']}\n"
            "Extraction: ${response['extraction']}\n"
            "Confidence: ${response['confidence']}%";
      });
    } catch (e) {
      setState(() {
        result = "❌ Error connecting to server";
      });
    }

    setState(() {
      loading = false;
    });
  }

  // 🎨 UI
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("🦷 Dental AI Analyzer"),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [

            // 🖼 IMAGE
            _image != null
                ? ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: Image.network(_image!.path, height: 200),
                  )
                : const Icon(Icons.image, size: 120, color: Colors.grey),

            const SizedBox(height: 20),

            // 📁 GALLERY BUTTON
            ElevatedButton.icon(
              onPressed: () => pickImage(ImageSource.gallery),
              icon: const Icon(Icons.photo),
              label: const Text("Upload from Gallery"),
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(double.infinity, 50),
              ),
            ),

            const SizedBox(height: 10),

            // 📸 CAMERA BUTTON
            ElevatedButton.icon(
              onPressed: () => pickImage(ImageSource.camera),
              icon: const Icon(Icons.camera_alt),
              label: const Text("Take Photo"),
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(double.infinity, 50),
              ),
            ),

            const SizedBox(height: 20),

            // 🔍 ANALYZE BUTTON
            ElevatedButton(
              onPressed: analyzeImage,
              child: const Text("Analyze"),
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(double.infinity, 50),
              ),
            ),

            const SizedBox(height: 30),

            // ⏳ LOADING
            if (loading) const CircularProgressIndicator(),

            const SizedBox(height: 20),

            // 📊 RESULT
            Text(
              result,
              style: const TextStyle(fontSize: 16),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}