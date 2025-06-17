import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { updatePassword } from 'firebase/auth';
import React, { JSX, useContext, useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth } from '../firebaseConfig';
import { UserContext } from './../UserContext';

export default function ModifierProfilScreen(): JSX.Element {
  const { imageUri } = useContext(UserContext);
  const router = useRouter();

  const [newPassword, setNewPassword] = useState('');

  const handlePasswordChange = async () => {
    const user = auth.currentUser;

    if (user && newPassword.trim().length >= 6) {
      try {
        await updatePassword(user, newPassword);
        Alert.alert('Succès', 'Mot de passe mis à jour avec succès.');
        setNewPassword('');
      } catch (error: any) {
        Alert.alert('Erreur', error.message);
      }
    } else {
      Alert.alert('Erreur', 'Veuillez saisir un mot de passe valide (au moins 6 caractères).');
    }
  };

  return (
    <View style={styles.container}>
      {/* Bouton retour */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={30} color="#0D99B2" />
      </TouchableOpacity>

      {/* Image de profil */}
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.avatar} />
      )}

      {/* Champs de modification */}
      <Text style={styles.label}>Nom et Prénom</Text>
      <TextInput style={styles.input} placeholder="Votre nom" placeholderTextColor="#075B7A99" />

      <Text style={styles.label}>Téléphone</Text>
      <TextInput style={styles.input} placeholder="06..." keyboardType="phone-pad" placeholderTextColor="#075B7A99" />

      <Text style={styles.label}>Mail</Text>
      <TextInput style={styles.input} placeholder="email@example.com" keyboardType="email-address" placeholderTextColor="#075B7A99" />

      <Text style={styles.label}>Téléphone (pro)</Text>
      <TextInput style={styles.input} placeholder="Autre numéro" keyboardType="phone-pad" placeholderTextColor="#075B7A99" />

      {/* Nouveau mot de passe */}
      <Text style={styles.label}>Nouveau mot de passe</Text>
      <TextInput
        style={styles.input}
        placeholder="********"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        placeholderTextColor="#075B7A99"
      />

      <TouchableOpacity style={styles.button} onPress={handlePasswordChange}>
        <Text style={styles.buttonText}>Changer le mot de passe</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    paddingTop: 12,
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  avatar: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#5CA9B0',
    borderWidth: 3,
    borderColor: '#075B7A',
    marginBottom: 30,
    resizeMode: 'cover',
  },
  label: {
    fontSize: 18,
    color: '#075B7A',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F5FBFD',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#075B7A',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  button: {
    backgroundColor: '#0D99B2',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
