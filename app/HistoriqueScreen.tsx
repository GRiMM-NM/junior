import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { JSX, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface HistoriqueItem {
  Id_historique: string;
  type_Historique: string;
  nom: string;
  date_action: string;
}

export default function MissionsRecemment(): JSX.Element {
  const router = useRouter();
  const [historique, setHistorique] = useState<HistoriqueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const fetchHistorique = async () => {
      try {
        const response = await fetch("http://172.20.10.13:5001/juniorfirebase-d7603/us-central1/getHistorique");
        const data = await response.json();
        setHistorique(data.historique);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'historique :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorique();
  }, []);

  return (
    <View style={styles.container}>
      {/* Bouton retour */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={30} color="#0D99B2" />
      </TouchableOpacity>

      <Text style={styles.title}>Historique récent</Text>

      {/* Chargement ou contenu */}
      {loading ? (
        <Animated.View style={{ transform: [{ scale: scaleAnim }], marginTop: 40 }}>
          <ActivityIndicator size="large" color="#15ACCD" />
        </Animated.View>
      ) : (
        <ScrollView>
          {historique.map((item) => (
            <MissionCard
              key={item.Id_historique}
              titre={item.nom}
              description={`${item.type_Historique} - ${new Date(item.date_action).toLocaleDateString()}`}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

interface MissionCardProps {
  titre: string;
  description: string;
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
