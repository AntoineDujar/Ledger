import { Link, router } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Auth from '../../components/Auth';
import Expense from '../../components/Expense';
import Account from '../../components/Account';
import { userAuth } from '../../lib/store';
import '@tamagui/core/reset.css';
import {
  Tamagui,
  TamaguiProvider,
  View,
  createTamagui,
} from '@tamagui/core';
import config from '../../tamagui.config';
import MyButton from '@/ui/MyButton';

const tamaGuiconfig = createTamagui(config);

type Conf = typeof tamaGuiconfig;

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

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
    <TamaguiProvider config={tamaGuiconfig}>
      <View style={styles.container}>
        {session && session.user ? (
          <View>
            <Account />
            <Expense />
          </View>
        ) : (
          <Auth />
        )}
        <Link href='/user/'>Go to user page</Link>
        <MyButton
          label='to user page'
          onPress={() => router.push('buttonEdit')}
        />
      </View>
    </TamaguiProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    marginBottom: 10,
    fontSize: 25,
  },
});
