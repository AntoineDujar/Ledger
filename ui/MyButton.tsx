import React from 'react';
import {
  Pressable,
  View,
  StyleSheet,
  PressableProps,
} from 'react-native';

import { Button, Text, Theme } from 'tamagui';

interface ButtonProps extends PressableProps {
  label: string;
  onPress: () => void;
}

const MyButton: React.FC<ButtonProps> = ({
  label,
  onPress,
  ...props
}) => {
  return (
    <Theme name='light'>
      <Theme name='green'>
        <Button
          alignSelf='center'
          minWidth={220}
          size='$3'
          spaceFlex={true}
          onPress={onPress}
        >
          <Text fontFamily='$body' fontWeight='800'>
            {label}
          </Text>
        </Button>
      </Theme>
    </Theme>
  );
};

export default MyButton;
