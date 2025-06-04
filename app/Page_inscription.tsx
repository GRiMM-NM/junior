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
import type { RootStackParamList } from './Connexion'; // à adapter selon le chemin

type Props = NativeStackScreenProps<RootStackParamList, 'Page_inscription'>;

export default function Page_inscription({ navigation }: Props) {
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
          <Text style={styles.paragraph}>Nouveau compte</Text>

          <Text style={styles.infos}>Nom et prénom</Text>
          <View style={styles.container1}>
            <TextInput
              style={styles.card}
              placeholder="NOM Prénom"
              value={texte}
              onChangeText={setTexte}
            />

            <Text style={styles.infos1}>Date de naissance</Text>
            <TextInput
              style={styles.card}
              placeholder="DD/MM/AAAA"
              value={texte1}
              onChangeText={setTexte1}
            />

            <Text style={styles.infos1}>Adresse e-mail</Text>
            <TextInput
              style={styles.card}
              placeholder="exemple@gmail.com"
              value={texte2}
              onChangeText={setTexte2}
            />

            <Text style={styles.infos1}>Mot de passe</Text>
            <TextInput
              style={styles.card}
              placeholder="********"
              value={texte3}
              onChangeText={setTexte3}
              secureTextEntry
            />
          </View>

          <View style={styles.container1}>
            <TouchableOpacity
              style={styles.card1}
              onPress={() => navigation.navigate('Home')}
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
