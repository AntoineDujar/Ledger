import React from 'react';
import { PressableProps } from 'react-native';

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
    <Button
      alignSelf='center'
      minWidth={220}
      size='$3'
      onPress={onPress}
    >
      <Text fontFamily='$body' fontWeight='800'>
        {label}
      </Text>
    </Button>
  );
};

export default MyButton;
