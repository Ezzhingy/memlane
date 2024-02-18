import * as Location from "expo-location";

export const getLocation = async (
  setLocation: (location: Location.LocationObject) => void
) => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.error("Permission to access location was denied");
    return;
  }

  let location = await Location.getCurrentPositionAsync();
  setLocation(location);
  return location;
};

export const getLocationName = async (
  setLocationName: (locationName: string) => void,
  latitude: number,
  longitude: number
) => {
  try {
    if (latitude && longitude) {
      const location = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (location && location.length > 0) {
        const { city, region, country } = location[0];
        setLocationName(`${city}, ${region}, ${country}`);
      }
      return "Location not found";
    }
  } catch (error) {
    console.error("Error fetching location:", error);
    return "Error fetching location";
  }
};
