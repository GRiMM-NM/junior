import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function PageBienvenue() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuotes() {
      try {
        const res = await fetch("http://172.20.10.13:5001/juniorfirebase-d7603/us-central1/getQuotes");
        const data = await res.json();
        setQuotes(data.quotes);
      } catch (error) {
        console.error("Erreur lors de la récupération des citations :", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuotes();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('./../assets/images/logo2.png')} style={styles.image} />

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

      <Text style={styles.heading}>Citations</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={quotes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.quoteCard}>
              <Text style={styles.quoteText}>{item}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
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
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  quoteCard: {
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: '90%',
  },
  quoteText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
