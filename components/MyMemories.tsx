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
    <View>
      <ScrollView horizontal style={styles.imageContainer}>
        {memories.map((memory, index) => {
          return (
            <View key={index}>
              <ImageBackground
                source={{ uri: memory[0] }}
                style={styles.image}
              />
              <Text style={{ color: "white", padding: 5 }}>{memory[1]}</Text>
            </View>
          );
        })}
      </ScrollView >
    </View >
  );
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    margin: 5,
    borderRadius: 10,
  },
  imageContainer: {
    display: "flex",
    flexDirection: "row",
    overflow: "scroll",
    paddingLeft: 24,
  },
});

export default MyMemories;
