import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

type Direction = 'left' | 'right' | 'down' | 'up' | 'upR' | 'upL' | 'downR' | 'downL';

interface MarqueeProps {
  texts: string[];
  fontSize: number;
  color: string;
  direction?: Direction;
  flowDirections?: Direction[];
  containerDimensions: { width: number; height: number };
  flowSpeed: number;
  durationBetweenUnit: number;
}

const Marquee: React.FC<MarqueeProps> = ({
  texts,
  fontSize,
  color,
  direction,
  flowDirections,
  containerDimensions,
  flowSpeed,
  durationBetweenUnit,
}) => {
  const { width, height } = containerDimensions;

  if (!direction && (!flowDirections || flowDirections.length === 0)) {
    throw new Error('Either direction or flowDirections must be specified');
  }

  const directions = flowDirections && flowDirections.length > 0 ? flowDirections : [direction!];

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1); // Start with 1 instead of 0

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentDirectionIndex, setCurrentDirectionIndex] = useState(0);

  const estimateTextWidth = useCallback((text: string) => {
    return text.length * fontSize * 0.6;
  }, [fontSize]);

  const getPositions = useCallback((dir: Direction, textWidth: number) => {
    const buffer = 50;
    // Center Y position accounts for text height (fontSize)
    const centerY = (height - fontSize) / 2;
    // Center X position accounts for text width
    const centerX = (width - textWidth) / 2;

    switch (dir) {
      case 'left':
        // Scroll from right to left horizontally, centered vertically
        // Make sure text passes through the visible area
        return {
          startX: width + buffer,
          startY: centerY,
          endX: -textWidth - buffer,
          endY: centerY,
        };
      case 'right':
        // Scroll from left to right horizontally, centered vertically
        // Make sure text passes through the visible area
        return {
          startX: -textWidth - buffer,
          startY: centerY,
          endX: width + buffer,
          endY: centerY,
        };
      case 'up':
        // Scroll from bottom to top vertically, centered horizontally
        return {
          startX: centerX,
          startY: height + buffer,
          endX: centerX,
          endY: -fontSize - buffer,
        };
      case 'down':
        // Scroll from top to bottom vertically, centered horizontally
        return {
          startX: centerX,
          startY: -fontSize - buffer,
          endX: centerX,
          endY: height + buffer,
        };
      case 'upR':
        // Diagonal: bottom-left to top-right
        return {
          startX: -textWidth - buffer,
          startY: height + buffer,
          endX: width + buffer,
          endY: -fontSize - buffer,
        };
      case 'upL':
        // Diagonal: bottom-right to top-left
        return {
          startX: width + buffer,
          startY: height + buffer,
          endX: -textWidth - buffer,
          endY: -fontSize - buffer,
        };
      case 'downR':
        // Diagonal: top-left to bottom-right
        return {
          startX: -textWidth - buffer,
          startY: -fontSize - buffer,
          endX: width + buffer,
          endY: height + buffer,
        };
      case 'downL':
        // Diagonal: top-right to bottom-left
        return {
          startX: width + buffer,
          startY: -fontSize - buffer,
          endX: -textWidth - buffer,
          endY: height + buffer,
        };
      default:
        return { startX: 0, startY: 0, endX: 0, endY: 0 };
    }
  }, [width, height, fontSize]);

  const advanceToNext = useCallback(() => {
    setCurrentTextIndex((prev) => (prev + 1) % texts.length);
    setCurrentDirectionIndex((prev) => (prev + 1) % directions.length);
  }, [texts.length, directions.length]);

  const animateText = useCallback(() => {
    const currentDirection = directions[currentDirectionIndex];
    const currentText = texts[currentTextIndex];
    const textWidth = estimateTextWidth(currentText);

    const positions = getPositions(currentDirection, textWidth);
    const distance = Math.sqrt(
      Math.pow(positions.endX - positions.startX, 2) +
      Math.pow(positions.endY - positions.startY, 2)
    );

    const duration = (distance / flowSpeed) * 1000;

    // Set initial position without animation (duration: 0)
    translateX.value = withTiming(positions.startX, { duration: 0 });
    translateY.value = withTiming(positions.startY, { duration: 0 });
    opacity.value = withTiming(1, { duration: 0 });

    // Start animation to end position with a small delay to ensure initial position renders
    translateX.value = withDelay(
      16, // One frame delay at 60fps
      withTiming(positions.endX, {
        duration,
        easing: Easing.linear,
      })
    );

    translateY.value = withDelay(
      16, // One frame delay at 60fps
      withTiming(
        positions.endY,
        {
          duration,
          easing: Easing.linear,
        },
        (finished) => {
          if (finished) {
            // Hide the text
            opacity.value = withTiming(0, { duration: 0 });

            // Wait for durationBetweenUnit, then advance to next
            translateX.value = withDelay(
              durationBetweenUnit,
              withTiming(0, { duration: 0 }, (finished) => {
                if (finished) {
                  runOnJS(advanceToNext)();
                }
              })
            );
          }
        }
      )
    );
  }, [
    currentTextIndex,
    currentDirectionIndex,
    texts,
    directions,
    estimateTextWidth,
    getPositions,
    flowSpeed,
    durationBetweenUnit,
    advanceToNext,
    translateX,
    translateY,
    opacity,
  ]);

  useEffect(() => {
    animateText();
  }, [currentTextIndex, currentDirectionIndex, animateText]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
      opacity: opacity.value,
    };
  });

  const currentText = texts[currentTextIndex];

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          // backgroundColor: 'green',
        },
      ]}
    >
      <Animated.Text
        style={[
          {
            fontSize,
            color,
            fontWeight: '700',
            position: 'absolute',
            top: 0,
            left: 0,
            lineHeight: 40,
            letterSpacing: -0.5,
          },
          animatedStyle,
        ]}
      >
        {currentText}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
});

export default Marquee;
