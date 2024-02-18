import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, View } from "./Themed";
import { ImageBackground, ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import { getLocation } from "@/app/functions/location";
import * as Location from "expo-location";

const NearbyMemories: React.FC = () => {
  const [memories, setMemories] = useState<any[]>([]);
  const [_, setLocation] = useState<Location.LocationObject>();

  useEffect(() => {
    const getMemories = async () => {
      const userMemoryIdsString = await AsyncStorage.getItem("memoryIds");
      const userMemoryIds = userMemoryIdsString ? JSON.parse(userMemoryIdsString) : [];

      const location = await getLocation(setLocation);
      if (location) {
        const data = await fetch(
          `/api/memory/nearby?longitude=${location.coords.longitude}&latitude=${location.coords.latitude}&radius=100`
        );
        const res = await data.json();
        
        // Filter out memories that belong to the user
        const filteredMemories = res.filter((memory: any) => !userMemoryIds.includes(memory.id));

        const newMemories = filteredMemories.map((memory: any) => [
          memory.file_url,
          memory.title,
        ]);
        setMemories(newMemories);
      }
    };
    getMemories();
  }, []);

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

export default NearbyMemories;
