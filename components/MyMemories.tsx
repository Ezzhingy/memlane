import { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, View } from "./Themed";
import { ImageBackground, ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import { AsyncStorageContext } from "@/app/_layout";
import { Link } from "expo-router";

const MyMemories: React.FC = () => {
  const [memories, setMemories] = useState<any[]>([]);
  const { didAsyncStorageUpdate, setDidAsyncStorageUpdate } =
    useContext(AsyncStorageContext);

  useEffect(() => {
    const getMemories = async () => {
      const userId = await AsyncStorage.getItem("id");
      if (userId) {
        const data = await fetch(`/api/user/memories/${userId}`);
        const res = await data.json();
        const newMemories = res.map((memory: any) => [
          memory.file_url,
          memory.title,
        ]);
        setMemories(newMemories);
      }
    };
    getMemories();
  }, [didAsyncStorageUpdate]);

  return (
    <View style={{ backgroundColor: 'transparent' }}>
      <ScrollView horizontal style={styles.imageContainer}>
        {memories.map((memory, index) => {
          return (
            <View key={index} style={{ backgroundColor: 'transparent' }}>
              <ImageBackground
                source={{ uri: memory[0] }}
                style={[styles.image, { backgroundColor: 'transparent' }]}
              />
              <Text style={{ color: "black", padding: 4, alignSelf: "center" }}>{memory[1]}</Text>
            </View>
          );
        })}
      </ScrollView >
    </View >
  );
};

const styles = StyleSheet.create({
  image: {
    borderRadius: 8,
    width: "100%",
    height: 200,
    paddingRight: 8,
  },
  imageContainer: {
    backgroundColor: "transparent",
    display: "flex",
    flexDirection: "row",
    overflow: "scroll",
    marginTop: 24,
    paddingBottom: 12,
    marginBottom: 24
  },
});

export default MyMemories;
