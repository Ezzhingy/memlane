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
      setTogglePicture(false);
      // console.log(data);
    }
  }

  async function startVideo() {
    if (cameraRef) {
      setIsStoppedRecording(false);
      const data = await cameraRef.current?.recordAsync();
      // console.log(data);
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
