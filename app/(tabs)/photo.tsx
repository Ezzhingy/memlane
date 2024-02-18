import { Camera, CameraType } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import CircleButton from "@/components/circlebutton";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [_, requestCameraPermissions] = Camera.useCameraPermissions();
  const [__, requestAudioPermissions] = Camera.useMicrophonePermissions();
  const [togglePicture, setTogglePicture] = useState(false);
  const [toggleVideo, setToggleVideo] = useState(false);
  const [isStoppedRecording, setIsStoppedRecording] = useState(true);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    requestCameraPermissions();
    requestAudioPermissions();
  }, []);

  function togglePictureType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  async function takePicture() {
    if (cameraRef) {
      const data = await cameraRef.current?.takePictureAsync({ base64: true });
      const base64 = data?.base64;
      let uri = data?.uri;

      if (uri) {
        const parts = uri.split('/');
        uri = parts[parts.length - 1];
      } 
      
      try {
        const requestBody = {
          fileName: uri,
          fileData: base64,
          fileType: "image/jpeg"
        };

        const response = await fetch('/api/storage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const responseData = await response.json();

          // Check if the request was successful
          if (response.ok) {
              console.log('File uploaded successfully:', responseData.url);
          } else {
              console.error('Error uploading file:', responseData.error);
          }
      } catch (error) {
          console.error('Error uploading file:', error);
      }
      console.log(uri);
      setTogglePicture(false);
    }
  }

  async function startVideo() {
    if (cameraRef) {
      setIsStoppedRecording(false);
      const data = await cameraRef.current?.recordAsync();
      let uri = data?.uri;
      if (uri) {
        const parts = uri.split('/');
        uri = parts[parts.length - 1];
      } 

      if (!uri) {
        console.error('Error starting video recording: URI is undefined');
        setIsStoppedRecording(true);
        return;
      }
      try {
        const response1 = await fetch(uri);
        const videoData = await response1.arrayBuffer();
        
        // Convert the video file data to base64
        // const base64Video = btoa(new Uint8Array(videoData).reduce((data, byte) => data + String.fromCharCode(byte), ''));
        // const base64Video = Buffer.from(videoData).toString('base64');

        const requestBody = {
          fileName: uri,
          fileData: videoData,
          fileType: "video/mov"
        };

        const response = await fetch('/api/storage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const responseData = await response.json();

        // Check if the request was successful
        if (response.ok) {
            console.log('File uploaded successfully:', responseData.url);
        } else {
            console.error('Error uploading video file:', responseData.error);
        }
      } catch (error) {
          console.error('Error uploading video file:', error);
      }
      console.log(uri);
    }
  }

  async function stopVideo() {
    if (cameraRef) {
      cameraRef.current?.stopRecording();
      setIsStoppedRecording(true);
      setToggleVideo(false);
    }
  }

  return (
    <View style={styles.container}>
      {togglePicture || toggleVideo ? (
        <Camera ref={cameraRef} style={styles.camera} type={type}>

          <View style={styles.buttonContainer}>

            <View style={styles.emptyView}></View>

            {togglePicture && (
              <TouchableOpacity style={styles.button} onPress={takePicture}>
                  <CircleButton onPress={takePicture} title=" " />
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.button} onPress={togglePictureType}>
              <Icon name="sync" size={40} color="white" />
            </TouchableOpacity>


            {toggleVideo && (
              <View>
                {isStoppedRecording ? (
                  <TouchableOpacity style={styles.button} onPress={startVideo}>
                    <Text style={styles.text}>Start Video</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.button} onPress={stopVideo}>
                    <Text style={styles.text}>Stop Video</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

          </View>
        </Camera>
      ) : (
        <View>
          <Pressable onPress={() => setTogglePicture(true)}>
            <Text style={styles.text}>take a picture</Text>
          </Pressable>
          <Pressable onPress={() => setToggleVideo(true)}>
            <Text style={styles.text}>take a video</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'black',
  },
  button: {
    flex: 1,
    alignSelf: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  emptyView: {
    flex: 1,
  },
});
