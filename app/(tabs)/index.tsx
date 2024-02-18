import { useContext, useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { getLocation, getLocationName } from "../functions/location";
import DisplayMap from "@/components/DisplayMap";
import { ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyMemories from "@/components/MyMemories";
import NearbyMemories from "@/components/NearbyMemories";
import { AsyncStorageContext } from "../_layout";

export default function HomeScreen() {
  const [locationName, setLocationName] = useState<string>();
  const [username, setUsername] = useState<string>();
  const { didAsyncStorageUpdate } = useContext(AsyncStorageContext);

  useEffect(() => {
    const fetchData = async () => {
      const tempLocation = await getLocation((_) => null);
      await getLocationName(
        setLocationName,
        tempLocation?.coords.latitude!,
        tempLocation?.coords.longitude!
      );
    };
    fetchData();
  }, []);

  useEffect(() => {
    const getUsername = async () => {
      try {
        const username = await AsyncStorage.getItem("username");
        if (username !== null) {
          setUsername(username);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getUsername();
  }, [didAsyncStorageUpdate]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Welcome back, {username}!</Text>
      <View
        style={styles.separator}
        lightColor="#bbbbbb"
        darkColor="rgba(255,255,255,0.1)"
      />
      {locationName ? (
        <Text style={styles.locationTitle}>{locationName}</Text>
      ) : (
        <Text style={styles.title}>Loading...</Text>
      )}
      <View style={styles.mapContainer}>
        <DisplayMap width={"100%"} height={250} />
      </View>
      <Text style={styles.title}>My Memories</Text>
      <MyMemories />

      <Text style={styles.title}>Explore Other Memories</Text>
      <NearbyMemories />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
  },
  titleContainer: {
  },
  mapContainer: {
    backgroundColor: "transparent",
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    paddingTop: 24,
  },
  separator: {
    marginVertical: 24,
    height: 1,
  },
  locationTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
