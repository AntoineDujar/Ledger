import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import MyButton from '../ui/MyButton';
import { userAuth } from '../lib/store';
import { H1, YStack } from 'tamagui';

export default function Account() {
  const session = userAuth((state) => state.currSession);

  async function signOut() {
    const { error } = await supabase.auth.signOut();
  }

  return (
    <YStack gap='$3'>
      {session && session.user ? (
        <H1 fontFamily='$heading' textAlign='center'>
          Welcome {session.user.email}
        </H1>
      ) : (
        <H1 fontFamily='$heading' textAlign='center'>
          Problem with user
        </H1>
      )}
      <MyButton label='Sign out' onPress={() => signOut()} />
    </YStack>
  );
}
