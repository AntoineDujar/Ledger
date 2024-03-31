import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { userCounterStore } from "./store";
import { Button } from "react-native";

export default function App() {
  const count = userCounterStore((state) => state.count);
  const increment = userCounterStore((state) => state.increment);
  const decrement = userCounterStore((state) => state.decrement);

  return (
    <View style={styles.container}>
      <Text>Zustand count: {count}</Text>
      <Button title="increment" onPress={increment}></Button>
      <Button title="decrement" onPress={decrement}></Button>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
