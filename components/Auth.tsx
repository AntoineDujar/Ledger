import React, { useState } from 'react';
import { Alert, StyleSheet, View, AppState } from 'react-native';
import { supabase } from '../lib/supabase';
import { Button, Input } from 'react-native-elements';
import MyButton from '../ui/MyButton';
import { YStack, Separator } from 'tamagui';
import { makeRedirectUri } from 'expo-auth-session';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession(); // required for web only
const redirectTo = makeRedirectUri();

const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;

  if (!access_token) return;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) throw error;
  return data.session;
};

const performOAuth = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });
  if (error) throw error;

  const res = await WebBrowser.openAuthSessionAsync(
    data?.url ?? '',
    redirectTo,
  );

  if (res.type === 'success') {
    const { url } = res;
    await createSessionFromUrl(url);
  }
};

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const url = Linking.useURL();
  if (url) createSessionFromUrl(url);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert('Please check your inbox for email verification!');
    setLoading(false);
  }

  return (
    <YStack>
      <Input
        label='Email'
        leftIcon={{ type: 'font-awesome', name: 'envelope' }}
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder='email@address.com'
        autoCapitalize={'none'}
      />
      <Input
        label='Password'
        leftIcon={{ type: 'font-awesome', name: 'lock' }}
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={true}
        placeholder='Password'
        autoCapitalize={'none'}
      />
      <Separator marginVertical={15} />
      <YStack gap='$2'>
        <MyButton label='Sign in' onPress={() => signInWithEmail()} />
        <MyButton label='Sign up' onPress={() => signUpWithEmail()} />
        <MyButton
          label='Sign in with GitHub'
          onPress={() => performOAuth()}
        />
      </YStack>
    </YStack>
  );
}
