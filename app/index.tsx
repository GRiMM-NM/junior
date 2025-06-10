import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native';

export default function DeuxPage() {
  const router = useRouter();
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 6000,
      useNativeDriver: true,
    }).start(() => {
      router.replace('/BienvenueScreen');
    });
  }, [router]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.Image
        source={require('./../assets/images/logo_Blanc.png')}
        style={[styles.logo, { transform: [{ rotate: spin }] }]}
      />
      <Text style={styles.paragraph2}>
        Bienvenue sur l application de la Junior Entreprise.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#1F8BA5',
    padding: 8,
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 25,
    resizeMode: 'contain',
  },
  paragraph2: {
    marginTop: 80,
    textAlign: 'center',
    color: 'white',
  },
});
