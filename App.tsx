import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { useEffect } from "react";
import { supabase } from "./lib/supabase";
import Auth from "./components/Auth";
import Expense from "./components/Expense";
import Account from "./components/Account";
import { userAuth } from "./lib/store";

export default function App() {
  const session = userAuth((state) => state.currSession);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      userAuth.setState({ currSession: session });
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      userAuth.setState({ currSession: session });
    });
  }, []);

  return (
    <View style={styles.container}>
      {session && session.user ? (
        <View>
          <Account />
          <Expense />
        </View>
      ) : (
        <Auth />
      )}
      {/* <Counter /> */}
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
  info: {
    marginBottom: 10,
    fontSize: 25,
  },
});
