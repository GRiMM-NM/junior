import { useThemeColors } from "@/hooks/useThemeColor";
import { RootStackParamList } from '@/navigation/RootNavigator'; // remplace par le bon chemin
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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



type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen() {
  const colors = useThemeColors()
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [texte, setTexte] = useState('');
  const [texte1, setTexte1] = useState('');

  return (
    <SafeAreaView style={[{ flex: 1 }, {backgroundColor: colors.tint}]}>
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
            meilleure expérience d utilisation avec notre application JE
          </Text>
          <Text style={styles.infos}>Adresse e-mail ou numéro de téléphone</Text>
          <View style={styles.container1}>
            <TextInput
              style={styles.card}
              placeholder="exemple@gmail.com"
              value={texte}
              onChangeText={setTexte}
            />
            <Text style={styles.infos1}>Mot de passe</Text>
            <TextInput
              style={styles.card}
              placeholder="********"
              value={texte1}
              onChangeText={setTexte1}
              secureTextEntry
            />
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Mdp_oublie')}>
            <Text
              style={{
                textDecorationLine: 'underline',
                color: '#15ACCD',
                textAlign: 'right',
              }}
            >
              Mot de passe oublié ?
            </Text>
          </TouchableOpacity>

          <View style={styles.container1}>
            <TouchableOpacity
              style={styles.card1}
              onPress={() => navigation.navigate('Accueil')}
            >
              <Text style={{ color: '#FFFFFF', textAlign: 'center' }}>
                Connexion
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.container1}>
            <TouchableOpacity
              style={styles.card1}
              onPress={() => navigation.navigate('Page_inscription')}
            >
              <Text style={{ color: '#FFFFFF', textAlign: 'center' }}>
                Crée un compte
              </Text>
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
  paragraph2: {
    marginTop: -30,
    textAlign: 'center',
  },
  paragraph1: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#15ACCD',
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
  container1: {
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 8,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
});

export default HomeScreen;