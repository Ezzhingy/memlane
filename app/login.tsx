import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, TextInput } from "react-native";

import { Text, View } from "@/components/Themed";
import { useContext, useState } from "react";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageContext } from "./_layout";

export default function LoginScreen() {
  const [userText, setUserText] = useState<string>("");
  const [passwordText, setPasswordText] = useState<string>("");
  const handleUserChange = (text: string) => setUserText(text);
  const handlePasswordChange = (text: string) => setPasswordText(text);
  const { didAsyncStorageUpdate, setDidAsyncStorageUpdate } =
    useContext(AsyncStorageContext);

  const handleSubmit = async () => {
    try {
      const data = await fetch(
        `/api/auth/login?username=${userText}&password=${passwordText}`
      );
      const res = await data.json();

      if (!res) {
        throw new Error("Error logging in");
      }
      await AsyncStorage.setItem("id", res[0].id.toString());
      await AsyncStorage.setItem("username", res[0].username);
      setDidAsyncStorageUpdate(!didAsyncStorageUpdate);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <TextInput
        style={styles.input}
        onChangeText={handleUserChange}
        value={userText}
        placeholder="Enter username"
      />
      <TextInput
        style={styles.input}
        onChangeText={handlePasswordChange}
        value={passwordText}
        placeholder="Enter password"
        secureTextEntry
      />
      <Link style={styles.submit} href="../" onPress={handleSubmit}>
        Log In
      </Link>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    color: "green",
    borderRadius: 2,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  submit: {
    borderRadius: 5,
    backgroundColor: "green",
    color: "white",
    padding: 10,
  },
});
