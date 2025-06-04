import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
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
import type { RootStackParamList } from './Connexion'; // à adapter selon l'organisation

type Props = NativeStackScreenProps<RootStackParamList, 'Mdp_oublie'>;

export default function Mdp_oublie({ navigation }: Props) {
  const [texte, setTexte] = useState('');
  const [texte1, setTexte1] = useState('');

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
            Vous avez oublié votre mot de passe ? Pas de souci, veuillez le réinitialiser ici.
          </Text>

          <Text style={styles.infos}>Mot de passe</Text>
          <View style={styles.container1}>
            <TextInput
              style={styles.card}
              placeholder="********"
              value={texte}
              onChangeText={setTexte}
              secureTextEntry
            />

            <Text style={styles.infos1}>Veuillez confirmer votre mot de passe</Text>
            <TextInput
              style={styles.card}
              placeholder="********"
              value={texte1}
              onChangeText={setTexte1}
              secureTextEntry
            />
          </View>

          <View style={styles.container1}>
            <TouchableOpacity
              style={styles.card1}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={{ color: '#FFFFFF', textAlign: 'center' }}>
                Créer un nouveau mot de passe
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
    marginTop: -30,
    textAlign: 'center',
  },
  infos: {
    marginTop: 70,
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
