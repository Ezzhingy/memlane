import { Button, DimensionValue, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import MapView, { Marker, Region } from "react-native-maps";
import { useEffect, useRef, useState } from "react";
// import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { getLocation } from "@/app/functions/location";
import { min } from "drizzle-orm";
import CustomMarker from "./CustomMarker";

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
      alignItems: "center",
      justifyContent: "flex-start",
      paddingTop: 24,
      paddingBottom: 24,
    },
    map: {
      width: width,
      height: height,
      alignSelf: "auto",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
  });

  const mapRef = useRef<MapView>(null);

  const [location, setLocation] = useState<Location.LocationObject>();
  const [region, setRegion] = useState<Region | undefined>({
    latitude: location?.coords.latitude!,
    longitude: location?.coords.longitude!,
    latitudeDelta: 0.0222,
    longitudeDelta: 0.0071,
  });
  const [markers, setMarkers] = useState<any>([]);
  const [followsUserLocation, setFollowsUserLocation] = useState(true);

  const handlePanDrag = () => {
    setFollowsUserLocation(false);
  };

  const markerInRange = (marker: any) => {
    if (location && location.coords.latitude && location.coords.longitude) {
      const R = 6371e3; // Earth radius in meters
      const lat1 = (location.coords.latitude * Math.PI) / 180; // convert to radians
      const lat2 = (marker.latitude * Math.PI) / 180;
      const deltaLat =
        ((marker.latitude - location.coords.latitude) * Math.PI) / 180;
      const deltaLon =
        ((marker.longitude - location.coords.longitude) * Math.PI) / 180;

      const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) *
          Math.cos(lat2) *
          Math.sin(deltaLon / 2) *
          Math.sin(deltaLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const distance = R * c; // in meters
      return distance <= 100;
    }
    return false;
  };

  const getNearbyMemories = async (
    latitude: GLfloat,
    longitude: GLfloat,
    radius: GLfloat
  ) => {
    try {
      const response = await fetch(
        `/api/memory/nearby?longitude=${longitude}&latitude=${latitude}&radius=${
          1609 * (radius / 2)
        }`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const markers = await Promise.all(
        data.map(async (memory: any) => {
          const response2 = await fetch(
            `/api/memory/visited?memory_id=${memory.id}&user_id=${1}`
          );

          if (!response2.ok) {
            throw new Error(`HTTP error! status: ${response2.status}`);
          }

          const data2 = await response2.json();

          const inRange = markerInRange(memory);

          return {
            ...memory,
            latlng: {
              latitude: memory.latitude,
              longitude: memory.longitude,
            },
            visited: data2.length > 0,
            markerInRange: inRange,
          };
        })
      );

      setMarkers(markers);
    } catch (error) {
      console.error("Failed to fetch nearby memories:", error);
    }
  };

  const calculateVisibleDistance = (latitudeDelta: number) => {
    // Each degree of latitude is approximately 111 kilometers
    const kilometersPerDegree = 111;

    // Calculate visible distance based on latitude delta
    const visibleDistance = latitudeDelta * kilometersPerDegree;

    return Math.min(visibleDistance, 1000);
  };

  useEffect(() => {
    const fetchData = async () => {
      const location = await getLocation(setLocation);
      setLocation(location);
      if (location) {
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0222,
          longitudeDelta: 0.0071,
        });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchNearbyMemories = async () => {
      if (region && region.latitude && region.longitude) {
        try {
          await getNearbyMemories(
            region.latitude,
            region.longitude,
            calculateVisibleDistance(region.latitudeDelta)
          );
        } catch (error) {
          console.error("Failed to fetch nearby memories:", error);
        }
      }
    };

    fetchNearbyMemories();
  }, [region]);

  const centerMapOnUser = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0222,
        longitudeDelta: 0.0071,
      });
    }
  };

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          onRegionChangeComplete={(region) => setRegion(region)}
          showsUserLocation
          followsUserLocation={followsUserLocation}
          showsMyLocationButton
          showsPointsOfInterest={false}
          onPanDrag={handlePanDrag}
        >
          <Button title="Center on user" onPress={centerMapOnUser} />
          {markers.map((marker: any, index: any) => {
            return (
              <CustomMarker
                key={index}
                coordinate={marker.latlng}
                {...marker}
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
//     // do something with the locations captured in the background
//   }
// });

export default DisplayMap;
