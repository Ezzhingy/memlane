import { StyleSheet } from "react-native";

import { View } from "@/components/Themed";
import DisplayMap from "@/components/DisplayMap";

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <DisplayMap width="100%" height="100%" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
