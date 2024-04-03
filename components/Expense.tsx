import React, { Children, useState, useEffect } from "react";
import { Button, Input, Text } from "react-native-elements";
import MyButton from "@/ui/MyButton";
import { Alert, StyleSheet, View, AppState, FlatList } from "react-native";
import { supabase } from "@/lib/supabase";
import { localExpenses, toSyncExpenses, userAuth } from "@/lib/store";

interface Expense {
  id: number;
  label: string;
  amount: number;
  auth_id: string;
  created_at: string;
}

export default function Spend() {
  const session = userAuth((state) => state.currSession);

  const [amount, setAmount] = useState("");
  const [label, setLabel] = useState("");

  function addLocalExpense() {
    const n = toSyncExpenses.getState().expense.length;
    const temp: Expense = {
      id: n,
      label: label,
      amount: parseFloat(amount),
      auth_id: "",
      created_at: "",
    };
    console.log(temp);
    const current = toSyncExpenses.getState().expense;
    toSyncExpenses.setState({ expense: [...current, temp] });
  }

  function whatToSync() {
    console.log(toSyncExpenses.getState().expense);
  }

  async function addExpense() {
    console.log("adding expense");
    if (session && session.user) {
      const { error } = await supabase
        .from("Expenditure")
        .insert({ label: label, amount: amount, auth_id: session.user.id });

      if (error) {
        console.log(error);
      } else {
        console.log("worked well!");
        setAmount("");
        setLabel("");
        fetchExpense();
      }
    } else {
      console.log("not logged in :(");
    }
  }

  async function fetchExpense() {
    console.log("fetching expenses");
    if (session && session.user) {
      const { data, error } = await supabase
        .from("Expenditure")
        .select()
        .eq("auth_id", session.user.id);

      if (error) {
        console.log(error);
      } else {
        console.log("fetched worked!");
        localExpenses.setState({ expense: data });
      }
    }
  }

  const Item = ({ label, amount }: Expense) => {
    return (
      <View style={styles.expense}>
        <Text style={styles.item}>{label}</Text>
        <Text style={styles.item}>{amount}</Text>
      </View>
    );
  };

  useEffect(() => {
    fetchExpense();
  }, []);

  return (
    <View style={styles.container}>
      <Input
        label="Amount"
        leftIcon={{ type: "font-awesome", name: "gift" }}
        onChangeText={(text) => setAmount(text)}
        value={amount}
      />
      <Input
        label="Label"
        leftIcon={{ type: "font-awesome", name: "pencil" }}
        onChangeText={(text) => setLabel(text)}
        value={label}
      />
      <MyButton label="Add" onPress={() => addExpense()} />
      <MyButton label="Sync" onPress={() => fetchExpense()} />
      <MyButton label="local" onPress={() => addLocalExpense()} />
      <MyButton label="what?" onPress={() => whatToSync()} />

      <FlatList
        data={localExpenses((state) => state.expense)}
        renderItem={({ item }) => <Item {...item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    marginBottom: 10,
    fontSize: 25,
  },
  expense: {
    flexDirection: "row",
    flex: 1,
  },
  item: {
    marginRight: 10,
    marginBottom: 10,
    fontSize: 25,
  },
});
