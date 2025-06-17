// en haut des imports
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth } from "../firebaseConfig";
import { useThemeColors } from './../hooks/useThemeColor';

export default function HomeScreen() {
  const colors = useThemeColors();
  const router = useRouter();

  const [email, setemail] = useState('');
  const [mdp, setmdp] = useState('');
  const [loading, setLoading] = useState(false);

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

const handleLogin = async () => {
  setLoading(true);
  try {
    // Connexion avec Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, mdp);
    const token = await userCredential.user.getIdToken();
    console.log("JWT:", token);

    // Gestion admin (local)
    if (isAdminMode) {
      if (adminPassword !== 'mdp_Admin') {
        Alert.alert("Erreur", "Mot de passe administrateur incorrect");
        return;
      }
      await AsyncStorage.setItem("isAdmin", "true");
    } else {
      await AsyncStorage.setItem("isAdmin", "false");
    }

    router.push('/Accueil');
  } catch (error: any) {
    Alert.alert("Erreur de connexion", error.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <SafeAreaView style={[{ flex: 1 }, { backgroundColor: colors.tint }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={50}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.paragraph}>Se connecter</Text>
          <Text style={styles.paragraph1}>Bienvenue</Text>
          <Text style={styles.paragraph2}>
            Nous sommes ravis de vous revoir et espérons que vous aurez la
            meilleure expérience d’utilisation avec notre application JE
          </Text>

          <Text style={styles.infos}>Adresse e-mail ou numéro de téléphone</Text>
          <View style={styles.container1}>
            <TextInput
              style={styles.card}
              placeholder="exemple@gmail.com"
              value={email}
              onChangeText={setemail}
              placeholderTextColor="#ffffffaa"
            />

            <Text style={styles.infos1}>Mot de passe</Text>
            <TextInput
              style={styles.card}
              placeholder="********"
              value={mdp}
              onChangeText={setmdp}
              secureTextEntry
              placeholderTextColor="#ffffffaa"
            />
          </View>

          {/* Toggle administrateur */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
            <Text>Se connecter en tant qu’administrateur : </Text>
            <Switch value={isAdminMode} onValueChange={setIsAdminMode} />
          </View>

          {isAdminMode && (
            <View style={{ alignItems: 'center', marginTop: 10 }}>
            <TextInput
              style={styles.card}
              placeholder="Mot de passe admin"
              secureTextEntry
              value={adminPassword}
              onChangeText={setAdminPassword}
              placeholderTextColor="#ffffffaa"
            />
            </View>
          )}

          <TouchableOpacity onPress={() => router.push('/Mdp_oublie')}>
            <Text style={styles.linkText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <View style={styles.container1}>
            <TouchableOpacity
              style={styles.card1}
              onPress={handleLogin}
            >
              <Text style={styles.buttonText}>Connexion</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.container1}>
            <TouchableOpacity
              style={styles.card1}
              onPress={() => router.push('/Page_inscription')}
            >
              <Text style={styles.buttonText}>Crée un compte</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#15ACCD',
  },
  paragraph1: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#15ACCD',
  },
  paragraph2: {
    marginTop: -30,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  infos: {
    marginTop: 70,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#16698C',
  },
  infos1: {
    marginTop: 20,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#16698C',
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
    width: 100,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  container1: {
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 8,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  linkText: {
    textDecorationLine: 'underline',
    color: '#15ACCD',
    textAlign: 'right',
    paddingHorizontal: 20,
    marginTop: 8,
  },
});
