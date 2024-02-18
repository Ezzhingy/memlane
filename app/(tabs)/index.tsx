import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { getLocation, getLocationName } from "../functions/location";
import DisplayMap from "@/components/DisplayMap";

export default function HomeScreen() {
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
      <Text style={styles.title}>Welcome back, USERNAME</Text>
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
      <DisplayMap width="80%" height="60%" />

    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 60,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  locationTitle: {
    fontSize: 30,
    fontWeight: "bold",
    paddingLeft: 60,
  },
});
