import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { JSX } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MissionCardProps {
  titre: string;
  description: string;
}

export default function MissionsRecemment(): JSX.Element {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Bouton retour */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={30} color="#0D99B2" />
      </TouchableOpacity>

      <Text style={styles.title}>Missions récemment consultées</Text>

      {/* Liste des missions */}
      <ScrollView>
        <MissionCard titre="Mission 1" description="Accompagner un événement local" />
        <MissionCard titre="Mission 2" description="Distribution de repas solidaires" />
        <MissionCard titre="Mission 3" description="Aide à l'inclusion numérique" />
      </ScrollView>
    </View>
  );
}

function MissionCard({ titre, description }: MissionCardProps): JSX.Element {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{titre}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  backButton: {
    marginBottom: 10,
    paddingTop: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#075B7A",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#F5FBFD",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#075B7A",
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: "#333",
  },
});
