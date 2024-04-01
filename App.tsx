import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { userCounterStore } from "./store";
import { Button } from "react-native";
import { supabase } from "./supabase";
import { useEffect } from "react";

export default function App() {
  const count = userCounterStore((state) => state.count);
  const increment = userCounterStore((state) => state.increment);
  const decrement = userCounterStore((state) => state.decrement);

  const sync = async () => {
    const { data, error } = await supabase
      .from("counter")
      .select()
      .eq("id", "1");

    if (data) {
      console.log(data[0].counter);
      userCounterStore.setState({ count: data[0].counter });
    }

    if (error) {
      console.log("device is offline");
      console.log("sync error:", error);
    }
  };

  const insertSync = async () => {
    const { error } = await supabase
      .from("counter")
      .update({ counter: userCounterStore.getState().count })
      .eq("id", 1);

    if (error) {
      console.log("device is offline");
      console.log("sync error:", error);
    }
  };

  const incrementSync = async () => {
    increment();
    await insertSync();
    console.log(userCounterStore.getState().count);
  };

  const decrementSync = async () => {
    decrement();
    await insertSync();
    console.log(userCounterStore.getState().count);
  };

  useEffect(() => {
    sync();
  }, []);

  // setInterval(sync, 5000);

  return (
    <View style={styles.container}>
      <Button title="refresh" onPress={sync}></Button>
      <Text>Zustand count: {count}</Text>
      <Button title="increment" onPress={incrementSync}></Button>
      <Button title="decrement" onPress={decrementSync}></Button>
      {/* <Button title="insertSync" onPress={insertSync}></Button> */}
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
