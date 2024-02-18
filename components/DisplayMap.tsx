import { DimensionValue, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import MapView, { Region } from "react-native-maps";
import { useEffect, useState } from "react";
// import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { getLocation } from "@/app/functions/location";

// const LOCATION_TASK_NAME = "background-location-task";

// const requestPermissions = async () => {
//   const { status: foregroundStatus } =
//     await Location.requestForegroundPermissionsAsync();
//   if (foregroundStatus === "granted") {
//     const { status: backgroundStatus } =
//       await Location.requestBackgroundPermissionsAsync();
//     if (backgroundStatus === "granted") {
//       await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
//         accuracy: Location.Accuracy.Balanced,
//       });
//     }
//   }
// };

interface DisplayMapProps {
  width: DimensionValue;
  height: DimensionValue;
}

const DisplayMap: React.FC<DisplayMapProps> = ({ width, height }) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    map: {
      width: width,
      height: height,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
  });

  const [location, setLocation] = useState<Location.LocationObject>();
  const [region, setRegion] = useState<Region | undefined>({
    latitude: location?.coords.latitude!,
    longitude: location?.coords.longitude!,
    latitudeDelta: 0.0222,
    longitudeDelta: 0.0071,
  });

  const getNearbyMemories = async (latitude: GLfloat, longitude: GLfloat) => {
    try {
      const response = await fetch(`/api/memory/nearby?longitude=${longitude}&latitude=${latitude}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    } catch (error) {
      console.error('Failed to fetch nearby memories:', error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await getLocation(setLocation);
    };
    fetchData();
    // requestPermissions();
  }, []);

  useEffect(() => {
    const fetchNearbyMemories = async () => {
      if (region && region.latitude && region.longitude) {
        console.log(region.latitude, region.longitude);
        try {
          await getNearbyMemories(region.latitude, region.longitude);
        } catch (error) {
          console.error('Failed to fetch nearby memories:', error);
        }
      }
    };

    fetchNearbyMemories();
  }, [region]);

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={(region) => setRegion(region)}
          showsUserLocation
          followsUserLocation
          showsMyLocationButton
          showsPointsOfInterest={false}
        >
          {/* {this.state.markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker.latlng}
              title={marker.title}
              description={marker.description}
            />
          ))} */}
        </MapView>
      ) : (
        <Text style={styles.title}>Loading...</Text>
      )}
    </View>
  );
};

// TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
//   if (error) {
//     // Error occurred - check `error.message` for more details.
//     return;
//   }
//   if (data) {
//     console.log("background", data);
//     // do something with the locations captured in the background
//   }
// });

export default DisplayMap;
