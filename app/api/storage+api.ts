import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import uploadFileToStorage from "@/utils/storage";
import fetch from 'node-fetch';

/*
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"fileName": "temp3.jpg", "filePath": "https://www.wikihow.com/images/thumb/d/d9/Add-a-Hyperlink-to-a-Jpeg-in-Photoshop-Step-3.jpg/v4-460px-Add-a-Hyperlink-to-a-Jpeg-in-Photoshop-Step-3.jpg", "fileType": "image/jpeg"}' \
  http://localhost:8081/api/storage


  curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"fileName": "temp5.jpg", "filePath": "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png", "fileType": "image/jpeg"}' \
  http://localhost:8081/api/storage

  curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"fileName": "audio.mp3", "filePath": "https://file-examples.com/wp-content/storage/2017/11/file_example_MP3_700KB.mp3", "fileType": "audio/mpeg"}' \
  http://localhost:8081/api/storage

https://file-examples.com/wp-content/storage/2017/11/file_example_MP3_700KB.mp3
*/

export async function POST(request: ExpoRequest): Promise<ExpoResponse> {
    try {
        // Extract fileName, filePath, and fileType from the request body
        const { fileName, filePath, fileType } = await request.json();

        if (!fileName || !filePath || !fileType) {
            throw new Error('Missing fileName, filePath, or fileType in the request body');
        }

        // Fetch the file from the URL
        const response = await fetch(filePath);
        const fileData = await response.arrayBuffer();
        const base64Data = btoa(new Uint8Array(fileData).reduce((data, byte) => data + String.fromCharCode(byte), ''));

        // Upload the file to Supabase storage
        const url = await uploadFileToStorage(fileName, base64Data, fileType);
        console.log('File uploaded successfully. URL:', url);

        // Return a success response with the uploaded file URL
        return ExpoResponse.json({ message: 'File uploaded successfully.', url });
    } catch (error) {
        console.error('Error uploading file:', error);
        // Return an error response
        return ExpoResponse.json({ error: 'Error uploading file.' });
    }
}
