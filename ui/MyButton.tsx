import React from "react";
import { Pressable, Text, StyleSheet, PressableProps } from "react-native";

interface ButtonProps extends PressableProps {
  label: string;
  onPress: () => void;
}

const MyButton: React.FC<ButtonProps> = ({ label, onPress, ...props }) => {
  return (
    <Pressable onPress={onPress} style={styles.button} {...props}>
      <Text style={styles.buttonLabel}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "grey",
    width: 200,
    height: 25,
    marginBottom: 10,
  },

  buttonLabel: {
    color: "white",
    fontSize: 16,
  },
});

export default MyButton;
