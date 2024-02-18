import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import supabase from "@/utils/supabase";
import { getLocation, getLocationName } from "../functions/location";
import * as Location from "expo-location";
import MapView from "react-native-maps";

export default function HomeScreen() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState<Location.LocationObject>();
  const [locationName, setLocationName] = useState<string>();

  useEffect(() => {
    const supabaseDBTest = async () => {
      const { data, error } = await supabase.from("user").select();

      if (error) {
        console.error(error);
        return;
      }

      setName(data[0]?.username);
    };

    supabaseDBTest();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const tempLocation = await getLocation(setLocation);
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
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location?.coords.latitude!,
            longitude: location?.coords.longitude!,
            latitudeDelta: 0.0222,
            longitudeDelta: 0.0071,
          }}
          showsUserLocation
          followsUserLocation
          showsMyLocationButton
          showsPointsOfInterest={false}
        />
      ) : (
        <Text style={styles.title}>Loading...</Text>
      )}
    </View>
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
  map: {
    width: "80%",
    height: "60%",
    paddingLeft: 60,
  },
});
