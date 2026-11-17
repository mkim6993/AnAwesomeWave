import { useEffect, useState } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface Star {
  id: number;
  width: number;
  height: number;
  left: string;
  top: string;
  delay: number;
}

const TwinklePreview = () => {
  // Generate random stars with varying sizes and positions
  const stars: Star[] = [
    { id: 1, width: 10, height: 20, left: '15%', top: '20%', delay: 0 },
    { id: 2, width: 5, height: 10, left: '70%', top: '15%', delay: 300 },
    { id: 3, width: 8, height: 16, left: '40%', top: '35%', delay: 600 },
    { id: 4, width: 6, height: 12, left: '85%', top: '45%', delay: 200 },
    { id: 5, width: 10, height: 20, left: '25%', top: '60%', delay: 800 },
    { id: 6, width: 7, height: 14, left: '60%', top: '70%', delay: 400 },
    { id: 7, width: 5, height: 10, left: '10%', top: '80%', delay: 100 },
    { id: 8, width: 9, height: 18, left: '80%', top: '25%', delay: 700 },
    { id: 9, width: 6, height: 12, left: '50%', top: '50%', delay: 500 },
    { id: 10, width: 10, height: 20, left: '35%', top: '10%', delay: 900 },
  ];

  return (
    <View style={styles.container}>
      {stars.map((star) => (
        <TwinklingStar key={star.id} star={star} />
      ))}
    </View>
  );
};

interface TwinklingStarProps {
  star: Star;
}

const TwinklingStar = ({ star }: TwinklingStarProps) => {
  // Use useState with lazy initialization to avoid ref access during render
  const [glowScale] = useState(() => new Animated.Value(1));
  const [glowOpacity] = useState(() => new Animated.Value(0.3));
  const [starOpacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(glowScale, {
              toValue: 2.5,
              duration: 1500,
              delay: star.delay,
              useNativeDriver: true,
            }),
            Animated.timing(glowScale, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(glowOpacity, {
              toValue: 0.6,
              duration: 1500,
              delay: star.delay,
              useNativeDriver: true,
            }),
            Animated.timing(glowOpacity, {
              toValue: 0.2,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(starOpacity, {
              toValue: 1,
              duration: 1500,
              delay: star.delay,
              useNativeDriver: true,
            }),
            Animated.timing(starOpacity, {
              toValue: 0,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    };

    animate();
  }, [star.delay, glowScale, glowOpacity, starOpacity]);

  return (
    <View
      style={[
        styles.starContainer,
        {
          left: star.left,
          top: star.top,
        },
      ]}
    >
      {/* Glowing opaque container */}
      <Animated.View
        style={[
          styles.glow,
          {
            width: star.width * 3,
            height: star.height * 3,
            borderRadius: star.width * 1.5,
            transform: [{ scale: glowScale }],
            opacity: glowOpacity,
          },
        ]}
      />
      {/* Star core */}
      <View
        style={[
          styles.star,
          {
            width: star.width,
            height: star.height,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.starCore,
            {
              opacity: starOpacity,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  starContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  star: {
    backgroundColor: 'black',
  },
  starCore: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
});

export default TwinklePreview;
