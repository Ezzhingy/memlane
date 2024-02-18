import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, View } from "./Themed";
import { ImageBackground, ScrollView } from "react-native";
import { StyleSheet } from "react-native";

const MyMemories: React.FC = () => {
  const [memories, setMemories] = useState<any[]>([]);

  useEffect(() => {
    const getUserId = async () => {
      const userId = await AsyncStorage.getItem("id");
      if (userId) {
        const data = await fetch(`/api/user/memories/1`);
        const res = await data.json();
        const newMemories = res.map((memory: any) => [
          memory.file_url,
          memory.title,
        ]);
        setMemories(newMemories);
      }
    };
    getUserId();
  }, []);

  return (
    <View>
      <ScrollView horizontal style={styles.imageContainer}>
        {memories.map((memory, index) => {
          return (
            <View>
              <ImageBackground
                key={index}
                source={{ uri: memory[0] }}
                style={styles.image}
              />
              <Text style={{ color: "white", padding: 5 }}>{memory[1]}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
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
