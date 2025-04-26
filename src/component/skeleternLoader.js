import React, { useRef, useState, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

const SkeletonCard = ({
  height,
  borderRadius,
  shimmerColor,
  backgroundColor,
  contentColor = backgroundColor,
  isLoading,
  onDataLoaded,
}) => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current; // Shimmer animation value
  const { colors } = useTheme();

  // Animation effect for shimmer opacity
  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnimation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnimation, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isLoading]);

  return (
    <Animated.View
      style={[
        styles.skeletonCard,
        {
          height,
          borderRadius,
          backgroundColor: shimmerColor || colors.border, // Shimmer color
          opacity: shimmerAnimation, // Shimmer opacity animation
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeletonCard: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
});

export default SkeletonCard;
