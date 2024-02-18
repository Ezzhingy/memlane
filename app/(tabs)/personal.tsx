import { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, View } from "@/components/Themed";
import { ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import { AsyncStorageContext } from "@/app/_layout";

const PersonalScreen: React.FC = () => {
  const [memories, setMemories] = useState<any[]>([]);
  const { didAsyncStorageUpdate } = useContext(AsyncStorageContext);

  useEffect(() => {
    const getMemories = async () => {
      const userId = await AsyncStorage.getItem("id");
      if (userId) {
        const data = await fetch(`/api/user/memories/${userId}`);
        const res = await data.json();
        const newMemories = res.map((memory: any) => [
          memory.title,
          memory.description,
          memory.created_at,
        ]);
        newMemories.sort((a: any, b: any) => {
          return new Date(b[2]).getTime() - new Date(a[2]).getTime();
        });
        setMemories(newMemories);
      }
    };
    getMemories();
  }, [didAsyncStorageUpdate]);

  return (
    <View style={{ backgroundColor: "transparent" }}>
      <ScrollView style={styles.imageContainer}>
        {memories.map((memory, index) => {
          return (
            <View key={index} style={{ backgroundColor: "transparent" }}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "black",
                    padding: 4,
                    alignSelf: "center",
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  {new Date(memory[2]).toLocaleDateString()}
                </Text>
                <View>
                  <Text
                    style={{
                      color: "black",
                      padding: 4,
                      alignSelf: "center",
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                  >
                    {memory[0]}
                  </Text>
                  <Text
                    style={{ color: "black", padding: 4, alignSelf: "center" }}
                  >
                    {memory[1]}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    borderRadius: 8,
    width: 200,
    height: 200,
    paddingRight: 8,
  },
  imageContainer: {
    backgroundColor: "transparent",
    overflow: "scroll",
    marginTop: 24,
    paddingBottom: 12,
    marginBottom: 24,
  },
});

export default PersonalScreen;
