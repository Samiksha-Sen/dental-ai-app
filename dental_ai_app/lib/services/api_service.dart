import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static Future<Map<String, dynamic>> uploadImage(String imagePath) async {
   var uri = Uri.parse("http://172.25.34.198:5000/predict");

    var request = http.MultipartRequest('POST', uri);

    request.files.add(
      await http.MultipartFile.fromPath('file', imagePath),
    );

    var response = await request.send();
    var responseData = await response.stream.bytesToString();

    return jsonDecode(responseData);
  }
}