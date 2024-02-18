import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import supabase from "@/utils/supabase";
import { getLocation, getLocationName } from "../functions/location";
import DisplayMap from "@/components/DisplayMap";
import * as Location from "expo-location";
import MapView, { Region } from "react-native-maps";

export default function HomeScreen() {
  // const [name, setName] = useState("");
  const [locationName, setLocationName] = useState<string>();

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

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Welcome back, USERNAME</Text>
        {locationName ? (
          <Text style={styles.locationTitle}>{locationName}</Text>
        ) : (
          <Text style={styles.title}>Loading...</Text>
        )}
      </View>
      <DisplayMap width="80%" height="60%" />
      <View style={styles.titleContainer}>
        <Text>Your Memories</Text>
        <View></View>
      </View>
    </View>
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
    fontSize: 20,
    fontWeight: "bold",
  },
  locationTitle: {
    fontSize: 30,
    fontWeight: "bold",
  },
});
