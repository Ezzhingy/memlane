import * as FileSystem from 'expo-file-system';

export default async function getVideoBinaryData(uri:string) {
  try {
    // Read the video file as binary data
    const binaryData = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return binaryData;
  } catch (error) {
    console.error('Error reading video file:', error);
    return null;
  }
}
