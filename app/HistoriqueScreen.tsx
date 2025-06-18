import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { JSX, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  description_historique: string;
  nom: string;
  date_action: string;
}

export default function MissionsRecemment(): JSX.Element {
  const router = useRouter();
  const [historiquePasse, setHistoriquePasse] = useState<HistoriqueItem[]>([]);
  const [historiqueAVenir, setHistoriqueAVenir] = useState<HistoriqueItem[]>([]);
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

  const fetchHistorique = async () => {
    try {
      const response = await fetch("http://172.20.10.13:5001/juniorfirebase-d7603/us-central1/getHistorique");
      const data = await response.json();

      const now = new Date();

      const passe = data.historique.filter((item: HistoriqueItem) =>
        new Date(item.date_action) < now
      );
      const avenir = data.historique.filter((item: HistoriqueItem) =>
        new Date(item.date_action) >= now
      );

      setHistoriquePasse(passe);
      setHistoriqueAVenir(avenir);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorique();
  }, []);

  const handleDeleteHistorique = (id: string) => {
    Alert.alert(
      "Confirmation",
      "Souhaitez-vous vraiment vous désinscrire ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Oui",
          onPress: async () => {
            try {
              const res = await fetch(
                "http://172.20.10.13:5001/juniorfirebase-d7603/us-central1/deleteHistorique",
                {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id_historique: id }),
                }
              );

              if (res.ok) {
                alert("Désinscription réussie !");
                setHistoriqueAVenir((prev) => prev.filter((item) => item.Id_historique !== id));
              } else {
                alert("Erreur lors de la désinscription.");
              }
            } catch (error) {
              alert("Erreur réseau.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={30} color="#0D99B2" />
      </TouchableOpacity>

      <Text style={styles.title}>Historique</Text>

      {loading ? (
        <Animated.View style={{ transform: [{ scale: scaleAnim }], marginTop: 40 }}>
          <ActivityIndicator size="large" color="#15ACCD" />
        </Animated.View>
      ) : (
        <ScrollView>
          <Text style={styles.sectionTitle}>À venir</Text>
          {historiqueAVenir.length === 0 ? (
            <Text style={styles.emptyText}>Aucun élément à venir</Text>
          ) : (
            historiqueAVenir.map((item) => (
              <MissionCard
                key={item.Id_historique}
                id={item.Id_historique}
                titre={item.nom}
                description={`${item.type_Historique} - ${new Date(item.date_action).toLocaleDateString()}`}
                contenu={item.description_historique}
                onDelete={handleDeleteHistorique}
              />
            ))
          )}

          <Text style={styles.sectionTitle}>Passé</Text>
          {historiquePasse.length === 0 ? (
            <Text style={styles.emptyText}>Aucun élément passé</Text>
          ) : (
            historiquePasse.map((item) => (
              <MissionCard
                key={item.Id_historique}
                id={item.Id_historique}
                titre={item.nom}
                description={`${item.type_Historique} - ${new Date(item.date_action).toLocaleDateString()}`}
                contenu={item.description_historique}
                onDelete={handleDeleteHistorique}
              />
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

interface MissionCardProps {
  id: string;
  titre: string;
  description: string;
  contenu: string;
  onDelete: (id: string) => void;
}

function MissionCard({ id, titre, description, contenu, onDelete }: MissionCardProps): JSX.Element {
  return (
    <TouchableOpacity
      onLongPress={() => onDelete(id)}
      style={styles.card}
    >
      <Text style={styles.cardTitle}>{titre}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
      <Text style={styles.cardContent}>{contenu}</Text>
    </TouchableOpacity>
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
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#0D99B2",
  },
  emptyText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#999",
    marginBottom: 10,
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
    marginBottom: 5,
  },
  cardContent: {
    fontSize: 13,
    color: "#555",
  },
});
