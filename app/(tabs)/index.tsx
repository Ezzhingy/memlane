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
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {locationName ? (
        <Text style={styles.locationTitle}>{locationName}</Text>
      ) : (
        <Text style={styles.title}>Loading...</Text>
      )}
      <DisplayMap width={350} height={250} />
      <Text style={styles.title}>My Memories</Text>
      <MyMemories />

      <Text style={styles.title}>Explore Other Memories</Text>
      <NearbyMemories />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    paddingLeft: 40,
    paddingTop: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    paddingLeft: 24,
    paddingTop: 24,
  },
  separator: {
    marginVertical: 24,
    height: 1,
  },
  locationTitle: {
    fontSize: 24,
    fontWeight: "bold",
    paddingLeft: 24,
  },
});
