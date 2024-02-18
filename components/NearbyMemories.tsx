import { useEffect, useState } from "react";
import { Text, View } from "./Themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
    <View style={{ backgroundColor: "transparent" }}>
      <ScrollView horizontal style={styles.imageContainer}>
        {memories.map((memory, index) => {
          return (
            <View key={index} style={{ backgroundColor: "transparent" }}>
              <ImageBackground
                source={{ uri: memory[0] }}
                style={[styles.image, { backgroundColor: "transparent" }]}
              />
              <Text style={{ color: "black", padding: 4, alignSelf: "center" }}>{memory[1]}</Text>
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
    marginRight: 8,
  },
  imageContainer: {
    backgroundColor: "transparent",
    display: "flex",
    flexDirection: "row",
    overflow: "scroll",
    marginTop: 24,
    paddingBottom: 12,
    marginBottom: 24,
  },
});

export default NearbyMemories;
