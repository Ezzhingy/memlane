import supabase from "@/utils/supabase";
import { decode } from 'base64-arraybuffer';

const storageBucketName = "treehacks24";

// Function to prepare base64 data URL
const prepareBase64DataUrl = (base64: string) =>
  base64.replace(/^data:.*?;base64,/, '');

export default async function uploadFileToStorage(fileName: string, file: any, fileType: string, options = {}) {
    try {
        // Determine content type based on file type
        let contentType = 'image/jpeg'; // Default content type for images
        
        // Convert the file to base64 string
        const base64Data = prepareBase64DataUrl(file);
        // Decode the base64 string to binary data
        const binaryData = decode(base64Data);
        let uploadData = binaryData;

        // If file type is video, use the provided content type
        if (fileType === 'video/mp4' || fileType === 'image/jpeg') {
            contentType = fileType;
            
        } else if (fileType === 'audio/mp3') {
            contentType = fileType;
            uploadData = file; // Don't convert to binary
        }

        // Upload the file to Supabase storage
        const { data, error } = await supabase.storage
            .from(storageBucketName)
            .upload(fileName, uploadData, {
                contentType,
                upsert: true,
            });

        if (error) {
            throw error;
        }

        // If upload is successful, return the URL of the uploaded file
        if (data) {
            const { data } = await supabase.storage
                .from(storageBucketName)
                .getPublicUrl(fileName);

            return data;
        }
    } catch (error) {
        console.error('Error uploading file to Supabase storage:', (error as Error).message);
        throw error;
    }
}
