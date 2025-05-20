import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const BAR_COUNT = 10;

const AudioVisualizer = ({ amplitude }) => {
  const bars = React.useRef(
    Array.from({ length: BAR_COUNT }, () => new Animated.Value(1))
  ).current;

  useEffect(() => {
    if (amplitude > 0) {
      bars.forEach((bar, i) => {
        const randomValue = Math.random() * amplitude;
        Animated.sequence([
          Animated.timing(bar, {
            toValue: 1 + randomValue,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(bar, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  }, [amplitude]);

  return (
    <View style={styles.container}>
      {bars.map((bar, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bar,
            {
              transform: [{ scaleY: bar }],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 100,
    gap: 4,
  },
  bar: {
    width: 4,
    height: 40,
    backgroundColor: '#00ff00',
    borderRadius: 2,
  },
});

export default AudioVisualizer;