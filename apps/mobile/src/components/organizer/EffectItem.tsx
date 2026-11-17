import { StyleSheet, Text, Pressable } from 'react-native';
import { ReactNode } from 'react';

interface EffectItemProps {
  label: string;
  children?: ReactNode | undefined;
  solidColor?: string;
  onPress: () => void;
}

const EffectItem = ({
  label,
  children = undefined,
  solidColor = 'gray',
  onPress,
}: EffectItemProps) => {
  return (
    <Pressable
      style={[
        styles.container,
        {
          backgroundColor: solidColor,
        },
      ]}
      onPress={onPress}
    >
      {children}
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 180,
    height: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    overflow: 'hidden',
  },
  label: {
    backgroundColor: 'black',
    fontWeight: '600',
    color: 'white',
    padding: 3,
    position: 'absolute',
    bottom: 0,
    fontSize: 18,
  },
});

export default EffectItem;
