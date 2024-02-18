import { DimensionValue, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import MapView, { Marker, Region } from "react-native-maps";
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
  const [markers, setMarkers] = useState<any>([]);

  const getNearbyMemories = async (latitude: GLfloat, longitude: GLfloat, radius: GLfloat) => {
    try {
      const response = await fetch(`/api/memory/nearby?longitude=${longitude}&latitude=${latitude}&radius=${1609 * (radius / 2)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const markers = data.map((memory: any) => {
        return {
          latlng: {
            latitude: memory.latitude,
            longitude: memory.longitude,
          },
          title: memory.title,
          description: memory.description || "",
        };
      });

      setMarkers(markers);
    } catch (error) {
      console.error('Failed to fetch nearby memories:', error);
    }
  }

  const calculateVisibleDistance = (latitudeDelta: number) => {
    // Each degree of latitude is approximately 111 kilometers
    const kilometersPerDegree = 111;

    // Calculate visible distance based on latitude delta
    const visibleDistance = latitudeDelta * kilometersPerDegree;

    return visibleDistance;
  };


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
        try {
          await getNearbyMemories(region.latitude, region.longitude, calculateVisibleDistance(region.latitudeDelta));
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
          {markers.map((marker: any, index: any) => {
            return (
              <Marker
                key={index}
                coordinate={marker.latlng}
                title={marker.title}
                description={marker.description || ""}
              />
            );
          })}
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
