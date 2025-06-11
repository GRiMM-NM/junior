import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Mission = {
  Id_Mission: string;
  titre: string;
  description_Mission: string;
  date_debut: string;
  date_fin: string;
  statut_Mission: string;
  date_creation_mission: string;
};

export default function MissionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMission = async () => {
      try {
        const response = await fetch("http://172.20.10.13:5001/juniorfirebase-d7603/us-central1/getMission"); // Remplace X par ton IP
        const json = await response.json();
        const data = json.mission;

        if (!Array.isArray(data)) {
          throw new Error("La propriété 'mission' n'est pas un tableau");
        }

        const selected = data.find((item) => item.Id_Mission === id);
        setMission(selected || null);
      } catch (error) {
        console.error("Erreur lors du chargement de la mission :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMission();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!mission) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>{"< Retour"}</Text>
        </TouchableOpacity>
        <Text style={styles.errorText}>Mission introuvable.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>{"< Retour"}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{mission.titre}</Text>
      <Text>{mission.description_Mission}</Text>
      <Text>Date de début : {new Date(mission.date_debut).toLocaleDateString()}</Text>
      <Text>Date de fin : {new Date(mission.date_fin).toLocaleDateString()}</Text>
      <Text>Statut : {mission.statut_Mission}</Text>

      {mission.statut_Mission === "ouverte" && (
        <Button title="S'inscrire à cette mission" onPress={() => console.log("Inscription...")} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    fontSize: 18,
    color: "#007bff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});
