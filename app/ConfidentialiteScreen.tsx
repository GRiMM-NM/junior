import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { JSX } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';


export default function ConfidentialiteScreen(): JSX.Element {
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

      <Text style={styles.title}>Confidentialité du compte</Text>

      <ScrollView>
        <Text style={styles.paragraph}>
          Cette section vous informe sur la gestion de vos données personnelles.
          Nous nous engageons à respecter votre vie privée et à protéger vos
          informations. Vous pouvez à tout moment modifier vos paramètres de
          confidentialité dans les options du profil.
        </Text>

        <Text style={styles.paragraph}>
          • Vos informations ne seront jamais partagées sans votre consentement.{"\n"}
          • Vous pouvez demander la suppression de votre compte.{"\n"}
          • Les données sont stockées de manière sécurisée.
        </Text>

        <Text style={styles.paragraph}>
          Pour plus de détails, contactez notre service d’assistance ou consultez
          notre politique de confidentialité complète.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
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
  paragraph: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 15,
  },
});
