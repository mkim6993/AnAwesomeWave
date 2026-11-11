import { View, StyleSheet, ViewStyle } from 'react-native';
import { ReactNode } from 'react';

interface OverlayContainerProps {
  visible: boolean;
  children: ReactNode;
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
}

const OverlayContainer = ({
  visible,
  children,
  containerStyle,
  contentStyle,
}: OverlayContainerProps) => {
  if (!visible) return null;

  return (
    <View style={[styles.overlay, containerStyle]}>
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: '10%',
    left: '5%',
    right: '5%',
    bottom: '10%',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  content: {
    width: '85%',
    alignItems: 'center',
  },
});

export default OverlayContainer;
