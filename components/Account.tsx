import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  AppState,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { Button, Input } from 'react-native-elements';
import MyButton from '../ui/MyButton';
import { userAuth } from '../lib/store';

export default function Account() {
  const session = userAuth((state) => state.currSession);

  async function signOut() {
    const { error } = await supabase.auth.signOut();
  }

  return (
    <View style={styles.container}>
      {session && session.user ? (
        <Text style={styles.info}>Welcome {session.user.email}</Text>
      ) : (
        <Text style={styles.info}>Problem with user</Text>
      )}
      <MyButton label='Sign out' onPress={() => signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    marginBottom: 10,
    fontSize: 25,
  },
});
