import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';

interface RainbowPreviewProps {
  durationPerColor?: number; // Duration in milliseconds for each color
}

const RainbowPreview = ({ durationPerColor = 500 }: RainbowPreviewProps) => {
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Neon rainbow colors
  const rainbowColors = [
    '#FF0080', // Neon Pink
    '#FF0000', // Neon Red
    '#FF8000', // Neon Orange
    '#FFFF00', // Neon Yellow
    '#00FF00', // Neon Green
    '#00FFFF', // Neon Cyan
    '#0080FF', // Neon Blue
    '#8000FF', // Neon Purple
  ];

  useEffect(() => {
    // Cycle through colors
    intervalRef.current = setInterval(() => {
      setCurrentColorIndex((prevIndex) => (prevIndex + 1) % rainbowColors.length);
    }, durationPerColor);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [durationPerColor, rainbowColors.length]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: rainbowColors[currentColorIndex],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
});

export default RainbowPreview;
