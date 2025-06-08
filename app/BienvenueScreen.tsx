import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function PageBienvenue() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('@/assets/images/logo2.png')} style={styles.image} />

      <View style={styles.container1}>
        <TouchableOpacity
          style={styles.card1}
          onPress={() => router.push('/Inscription')}
        >
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container1}>
        <TouchableOpacity
          style={styles.card1}
          onPress={() => router.push('/Page_inscription')}
        >
          <Text style={styles.buttonText}>S’inscrire</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 8,
    alignItems: 'center',
  },
  image: {
    width: 400,
    height: 400,
    marginBottom: 20,
    resizeMode: 'contain',
    marginLeft: 260,
    marginTop: -210,
  },
  card1: {
    marginTop: 10,
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#16698C',
    marginBottom: 12,
    width: 120,
  },
  container1: {
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 15,
  },
});
