import supabase from "@/utils/supabase";
import { decode } from 'base64-arraybuffer';

const storageBucketName = "treehacks24";

// Function to prepare base64 data URL
const prepareBase64DataUrl = (base64: string) =>
  base64.replace(/^data:image\/jpeg;base64,/, '');

// This works for images (png or jpg)
export default async function uploadFileToStorage(fileName: string, file: any, fileType: string, options = {}) {
    try {
        // Determine content type based on file type
        let contentType = 'image/jpeg'; // Default content type for images
        const preparedFile = Buffer.from(prepareBase64DataUrl(file), 'base64');

        // Upload the file to Supabase storage
        const { data, error } = await supabase.storage
            .from(storageBucketName)
            .upload(fileName, preparedFile, {
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
