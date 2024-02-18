// CircleButton.tsx

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CircleButtonProps {
  onPress: () => void;
  title: string;
}

const CircleButton: React.FC<CircleButtonProps> = ({ onPress, title }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
});

export default CircleButton;
