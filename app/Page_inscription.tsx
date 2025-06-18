import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from 'react';
import {
  Alert,
  Image,
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
import { auth } from "../firebaseConfig";
import { Row } from './../components/Row';

export default function PageInscription() {
  const router = useRouter();

  const [texte, setTexte] = useState('');
  const [texte1, setTexte1] = useState('');
  const [texte2, setTexte2] = useState('');
  const [texte3, setTexte3] = useState('');

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
          <Row>
            <TouchableOpacity onPress={() => router.back()}>
              <Image source={require('./../assets/images/arrow_back.png')} />
            </TouchableOpacity>
            <Text style={styles.paragraph}>Nouveau compte</Text>
          </Row>

          <Text style={styles.infos}>Nom et prénom</Text>
          <View style={styles.container1}>
            <TextInput
              style={styles.card}
              placeholder="NOM Prénom"
              value={texte}
              onChangeText={setTexte}
              placeholderTextColor="#ffffffaa"
            />

            <Text style={styles.infos1}>Date de naissance</Text>
            <TextInput
              style={styles.card}
              placeholder="DD/MM/AAAA"
              value={texte1}
              onChangeText={setTexte1}
              placeholderTextColor="#ffffffaa"
            />

            <Text style={styles.infos1}>Adresse e-mail</Text>
            <TextInput
              style={styles.card}
              placeholder="exemple@gmail.com"
              value={texte2}
              onChangeText={setTexte2}
              placeholderTextColor="#ffffffaa"
            />

            <Text style={styles.infos1}>Mot de passe</Text>
            <TextInput
              style={styles.card}
              placeholder="********"
              value={texte3}
              onChangeText={setTexte3}
              secureTextEntry
              placeholderTextColor="#ffffffaa"
            />
          </View>

          <View style={styles.container1}>
            <TouchableOpacity
              style={styles.card1}
              onPress={async () => {
                  try {
                    const userCredential = await createUserWithEmailAndPassword(auth, texte2, texte3);
                    const token = await userCredential.user.getIdToken();
                    console.log("JWT:", token);
                    router.replace('/Accueil');
                  } catch (error: any) {
                    Alert.alert("Erreur d'inscription", error.message);
                  }
                }}
            >
              <Text style={{ color: '#FFFFFF', textAlign: 'center' }}>Se connecter</Text>
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
  infos: {
    marginTop: 20,
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
    color: 'white',
  },
  infos1: {
    marginTop: 20,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#16698C',
  },
  card1: {
    marginTop: 10,
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#16698C',
    marginBottom: 12,
    width: 150,
  },
});
