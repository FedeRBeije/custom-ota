import { StyleSheet, Button } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useEffect } from "react";
import Constants from 'expo-constants';
import { Asset } from 'expo-asset';
import * as Updates from 'expo-updates';

export default function TabOneScreen() {

  const fetchUpdate = async () => {
    let data = await fetch('https://expo-updates.vercel.app/api/manifest')
    console.log(JSON.stringify(data, null, 2))
  };

  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      alert(`Error fetching latest Expo update: ${error}`);
    }
  }

  useEffect(() => {
    // fetchUpdate()
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SA SA OTA 5</Text>
      <Text style={styles.title}>{Constants?.expoConfig?.name}</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View>
      <Button title="Fetch update" onPress={onFetchUpdateAsync} />
    </View>
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
