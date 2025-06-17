import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { signOut } from "firebase/auth";
import React, { JSX } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth } from "../firebaseConfig";

export default function DeconnexionScreen(): JSX.Element {
  const router = useRouter();

  const handleExit = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("isAdmin"); // Supprime le rôle admin si stocké
      Alert.alert("Déconnexion réussie");
      router.replace("/"); // Redirige vers la page de connexion
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
      Alert.alert("Erreur", "Échec de la déconnexion");
    }
  };

  const handleCancel = () => {
    router.back(); // Retour à l'écran précédent
  };

  return (
    <View style={styles.container}>
      {/* Bouton retour */}
      <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
        <Ionicons name="chevron-back" size={30} color="#0D99B2" />
      </TouchableOpacity>

      {/* Avatar */}
      <View style={styles.avatar} />
      <Text style={styles.editPhoto}>modifier la photo</Text>

      {/* Liste de boutons simulée */}
      <View style={styles.fakeOptions}>
        <FakeOption label="Modifier le profil" />
        <FakeOption label="Missions récemment consultées" />
        <FakeOption label="Confidentialité du compte" />
        <FakeOption label="Réglage" />
        <FakeOption label="Aide" />
      </View>

      {/* Zone de confirmation */}
      <View style={styles.confirmBox}>
        <Text style={styles.confirmText}>
          Êtes-vous sûr de vouloir vous déconnecter ?
        </Text>
        <View style={styles.buttonsRow}>
          <TouchableOpacity style={styles.confirmButton} onPress={handleExit}>
            <Text style={styles.buttonText}>Oui</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton} onPress={handleCancel}>
            <Text style={styles.buttonText}>Non</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

interface FakeOptionProps {
  label: string;
}

function FakeOption({ label }: FakeOptionProps): JSX.Element {
  return (
    <View style={styles.optionRow}>
      <Text style={styles.optionLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color="#075B7A" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C5F1FF',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  avatar: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#5CA9B0',
    borderWidth: 3,
    borderColor: '#075B7A',
  },
  editPhoto: {
    textAlign: 'center',
    color: '#075B7A',
    fontSize: 16,
    marginVertical: 10,
  },
  fakeOptions: {
    marginVertical: 20,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#B2EBF2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionLabel: {
    fontSize: 16,
    color: '#075B7A',
  },
  confirmBox: {
    backgroundColor: '#15A9CE',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    marginTop: 'auto',
  },
  confirmText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  confirmButton: {
    backgroundColor: '#A6E4F4',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#075B7A',
    fontWeight: '600',
  },
});
