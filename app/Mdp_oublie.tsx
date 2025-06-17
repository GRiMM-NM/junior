import { useRouter } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth } from '../firebaseConfig';

export default function MdpOublie() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Succès",
        "Un lien de réinitialisation a été généré (voir l'UI de l'émulateur)."
      );
      router.push('/'); // retour à l'accueil ou login
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={50}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.paragraph}>Mot de passe oublié</Text>
          <Text style={styles.paragraph2}>
            Veuillez entrer votre email pour réinitialiser votre mot de passe.
          </Text>

          <Text style={styles.infos}>Adresse e-mail</Text>
          <View style={styles.container1}>
            <TextInput
              style={styles.card}
              placeholder="exemple@gmail.com"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#ffffffaa"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.container1}>
            <TouchableOpacity
              style={styles.card1}
              onPress={handleResetPassword}
            >
              <Text style={{ color: '#FFFFFF', textAlign: 'center' }}>
                Réinitialiser le mot de passe
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 8,
    backgroundColor: 'white',
    justifyContent: 'center',
    flexGrow: 1,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#15ACCD',
  },
  paragraph2: {
    marginTop: -10,
    textAlign: 'center',
    paddingHorizontal: 20,
    color: '#075B7A',
  },
  infos: {
    marginTop: 50,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#16698C',
  },
  container1: {
    alignItems: 'center',
  },
  card: {
    marginTop: 10,
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#1F8BA5',
    marginBottom: 12,
    width: 250,
    color: '#FFFFFF',
  },
  card1: {
    marginTop: 10,
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#16698C',
    marginBottom: 12,
    width: 250,
  },
});
