import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { JSX, useState } from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AideScreen(): JSX.Element {
  const [query, setQuery] = useState<string>('');

  const handleSearch = () => {
    if (query.trim() !== '') {
      const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      Linking.openURL(url);
    }
  };
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Bouton retour */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={30} color="#0D99B2" />
      </TouchableOpacity>

      <Text style={styles.title}>Aide & Support</Text>

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Rechercher une aide..."
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch}>
          <Feather name="search" size={24} color="#075B7A" />
        </TouchableOpacity>
      </View>

      {/* Infos supplémentaires */}
      <Text style={styles.hintText}>
        Vous pouvez poser une question sur Google ou visiter notre centre
        d aide pour plus d’informations.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  backButton: {
    marginBottom: 10,
    marginTop: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#075B7A',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5FBFD',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
  },
  hintText: {
    marginTop: 20,
    fontSize: 14,
    color: '#666',
  },
});
