import { Camera, CameraType } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [_, requestPermission] = Camera.useCameraPermissions();
  const [togglePicture, setTogglePicture] = useState(false);
  const [toggleVideo, setToggleVideo] = useState(false);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    requestPermission();
  }, []);

  function togglePictureType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  async function takePicture() {
    if (cameraRef) {
      const res = await cameraRef.current?.takePictureAsync({ base64: true });
      setTogglePicture(false);
    }
  }

  return (
    <View style={styles.container}>
      {togglePicture ? (
        <Camera ref={cameraRef} style={styles.camera} type={type}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={togglePictureType}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.text}>Take Picture</Text>
            </TouchableOpacity>
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
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
});
