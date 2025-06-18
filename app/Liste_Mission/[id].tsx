import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Explosion from "react-native-confetti-cannon";
import { ThemedeText } from "../../components/ThemedText";
import { Colors } from "../../constants/Colors";

const { width } = Dimensions.get("window");

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
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Nouvel état pour gérer l'animation de fade
  const confirmationOpacity = useRef(new Animated.Value(0)).current;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const confettiRef = useRef<Explosion>(null);
  
  const ajouterHistorique = async (
  nom: string,
  description: string,
  date: string
) => {
  try {
    const response = await fetch("http://172.20.10.13:5001/juniorfirebase-d7603/us-central1/addHistorique", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type_historique: "mission",
        nom,
        description_historique: description,
        date_action: date,
      }),
    });

    if (!response.ok) {
      console.error("Échec de l'ajout à l'historique");
    } else {
      console.log("Ajouté à l'historique avec succès");
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout à l'historique :", error);
  }
}

  useEffect(() => {
    const fetchMission = async () => {
      try {
        const response = await fetch(
          "http://172.20.10.13:5001/juniorfirebase-d7603/us-central1/getMission"
        );
        const json = await response.json();
        const data = json.mission;

        if (!Array.isArray(data)) throw new Error("Données non valides");

        const selected = data.find((item) => item.Id_Mission === id);
        setMission(selected || null);
      } catch (error) {
        console.error("Erreur :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMission();
  }, [id]);

  useEffect(() => {
    if (mission) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [mission]);

  // Quand showConfirmation change, on lance l'animation de fade-in/fade-out
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (showConfirmation) {
      // Fade in (apparition)
      Animated.timing(confirmationOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Lance les confettis
      confettiRef.current?.start();

      // Après 1s, fade out (disparition) puis hide
      timer = setTimeout(() => {
        Animated.timing(confirmationOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setShowConfirmation(false);
        });
      }, 1000);
    } else {
      // Si on cache directement, on remet à 0
      confirmationOpacity.setValue(0);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showConfirmation, confirmationOpacity]);

  if (loading)
    return <ActivityIndicator size="large" color={Colors.light.tint} />;

  if (!mission) {
    return (
      <View style={styles.centered}>
        <ThemedeText variant="subtitle1" color="closeRed">
          Mission introuvable.
        </ThemedeText>
      </View>
    );
  }

  const statutColor =
    mission.statut_Mission.toLowerCase() === "ouverte"
      ? Colors.type.openGreen
      : Colors.type.closeRed;

const onConfirm = () => {
  if (mission) {
    ajouterHistorique(
      mission.titre,
      mission.description_Mission,
      mission.date_fin
    );
  }
  setShowConfirmation(true);
};

  return (
    <View style={styles.container}>
      {/* Logo EPF en arrière-plan */}
      <Image
        source={require("../../assets/images/EPF_Projets_Logo.png")}
        style={styles.backgroundLogo}
        resizeMode="contain"
      />

      {/* Bouton retour */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <ThemedeText variant="subtitle1" color="grayWhite">
          {"< Retour"}
        </ThemedeText>
      </TouchableOpacity>

      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Carte animée */}
        <Animated.View
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ThemedeText variant="headline" color="darkBlue" style={styles.title}>
            {mission.titre}
          </ThemedeText>

          <ThemedeText variant="body3" color="black" style={styles.text}>
            {mission.description_Mission}
          </ThemedeText>

          <ThemedeText variant="subtitle2" color="grayLight" style={styles.text}>
            📅 Début : {new Date(mission.date_debut).toLocaleDateString()}
          </ThemedeText>
          <ThemedeText variant="subtitle2" color="grayLight" style={styles.text}>
            📅 Fin : {new Date(mission.date_fin).toLocaleDateString()}
          </ThemedeText>

          <ThemedeText
            variant="subtitle1"
            style={{ color: statutColor, marginTop: 8 }}
          >
            Statut : {mission.statut_Mission}
          </ThemedeText>
        </Animated.View>

        {/* Bouton d'action */}
        {mission.statut_Mission.toLowerCase() === "ouverte" && !showConfirmation && (
          <TouchableOpacity style={styles.button} onPress={onConfirm}>
            <ThemedeText variant="subtitle1" color="grayWhite">
              S’inscrire à cette mission
            </ThemedeText>
          </TouchableOpacity>
        )}

        {/* Confirmation + confettis avec animation fade */}
        {showConfirmation && (
          <Animated.View style={{ opacity: confirmationOpacity }}>
            <ThemedeText variant="subtitle1" style={styles.confirmationText}>
              🎉 Inscription confirmée !
            </ThemedeText>
            <Explosion
              count={200}
              origin={{ x: width / 2, y: 0 }}
              autoStart={false} // On démarre manuellement dans useEffect
              fadeOut={true}
              fallSpeed={750}
              ref={confettiRef}
            />
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.tint,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
    width: "100%",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundLogo: {
    position: "absolute",
    top: 100,
    width: width * 0.75,
    height: width * 0.75,
    opacity: 0.5,
    alignSelf: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
    zIndex: 1,
  },
  card: {
    marginTop: 200,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 24,
    padding: 24,
    width: width - 40,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    marginBottom: 12,
    textAlign: "center",
  },
  text: {
    marginBottom: 6,
  },
  button: {
    backgroundColor: Colors.light.darkBlue,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 18,
    marginTop: 30,
    alignSelf: "center",
  },
  confirmationText: {
    marginTop: 30,
    textAlign: "center",
    color: Colors.light.darkBlue,
    fontWeight: "bold",
  },
});
