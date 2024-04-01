import { supabase } from "./supabase";
import { StyleSheet, Text, View } from "react-native";
import { userCounterStore } from "./store";
import { useEffect } from "react";
import MyButton from "./MyButton";

export default function Counter() {
  const count = userCounterStore((state) => state.count);
  const increment = userCounterStore((state) => state.increment);
  const decrement = userCounterStore((state) => state.decrement);

  const sync = async () => {
    const { data, error } = await supabase
      .from("counter")
      .select()
      .eq("id", "1");

    if (data) {
      // console.log(data[0].counter);
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
  return (
    <View>
      <Text style={styles.info}>Zustand count: {count}</Text>
      <MyButton label="increment" onPress={incrementSync} />
      <MyButton label="decrement" onPress={decrementSync} />
      <MyButton label="sync" onPress={sync} />
    </View>
  );
}

const styles = StyleSheet.create({
  info: {
    marginBottom: 10,
    fontSize: 25,
  },
});
