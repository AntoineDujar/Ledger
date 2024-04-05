import { supabase } from '../lib/supabase';
import { View } from 'react-native';
import MyButton from '@/ui/MyButton';

const login = async function signInWithGithub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
  });

  console.log('login success');
  console.log(data);
};

const logout = async function signOut() {
  const { error } = await supabase.auth.signOut();
};

export default function Auth() {
  return (
    <View>
      <MyButton label='login' onPress={login} />
      <MyButton label='logout' onPress={logout} />
    </View>
  );
}
