import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "./../components/Card";
import { MissionCard } from "./../components/Mission/MissionCard";
import { Row } from "./../components/Row";
import { SearchBar } from "./../components/SearchBar";
import { ThemedeText } from "./../components/ThemedText";
import { useThemeColors } from "./../hooks/useThemeColor";

interface Mission {
  id: number;
  title: string;
  description: string;
}

export default function Accueil() {
  
  const [isAdmin, setIsAdmin] = useState(false);
  
  const router = useRouter();
  const colors = useThemeColors();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [search, setSearch] = useState("");
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [statutMission, setStatutMission] = useState("");
  const scaleAnim = useRef(new Animated.Value(1)).current;


useEffect(() => {
  const checkAdmin = async () => {
    const adminValue = await AsyncStorage.getItem("isAdmin");
    setIsAdmin(adminValue === "true");
  };
  checkAdmin();
}, []);

useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
    ])
  ).start();
}, [])

  useEffect(() => {
const fetchMissions = async () => {
    try {
      const titleResponse = await fetch("http://172.20.10.13:5001/juniorfirebase-d7603/us-central1/getTitle_Mission");
      const descResponse = await fetch("http://172.20.10.13:5001/juniorfirebase-d7603/us-central1/getDescription_Mission");
      const IdResponse = await fetch("http://172.20.10.13:5001/juniorfirebase-d7603/us-central1/getId_Mission")

      const titleData = await titleResponse.json();
      const descData = await descResponse.json();
      const IdData = await IdResponse.json();

      if (!titleData.quotes || !descData.quotes) {
        throw new Error("Format de données inattendu");
      }

      const missionsData: Mission[] = titleData.quotes.map((title: string, index: number) => ({
        id: IdData.quotes[index],
        title,
        description: descData.quotes[index] || "",
      }));

      setMissions(missionsData);
    } catch (error) {
      console.error("Erreur lors de la récupération des missions :", error);
    } finally {
      setLoading(false);
    }
  };

  fetchMissions();
}, []);

  const filteredMissions = missions.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

const addMission = async () => {
  if (!newTitle.trim() || !newDescription.trim()) return;

  try {
    const response = await fetch("http://172.20.10.13:5001/juniorfirebase-d7603/us-central1/addMission", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        titre: newTitle,
        description_Mission: newDescription,
        date_debut: dateDebut,
        date_fin: dateFin,
        statut_Mission: statutMission
      }),
    });

    const text = await response.text(); // on lit même si ce n'est pas du JSON
    if (!response.ok) {
      console.error("Réponse non OK :", response.status, text);
      throw new Error("Erreur lors de l'ajout de la mission");
    }

    const data = JSON.parse(text);
    const newMission: Mission = {
      id: data.insertedId || missions.length + 1,
      title: newTitle,
      description: newDescription,
    };
    

    setMissions([newMission, ...missions]);
    setNewTitle("");
    setNewDescription("");
    setDateDebut("");
    setDateFin("");
    setStatutMission("");
    setModalVisible(false);
  } catch (error) {
    console.error("Erreur lors de l'ajout de la mission :", error);
  }
};


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.tint }]}>
      <View style={styles.header}>
        <Image
          source={require("./../assets/images/EPF_Projets_Logo.png")}
          style={styles.logo}
        />
        <ThemedeText variant="headline" color="grayWhite" style={styles.title}>
          Missions Disponibles
        </ThemedeText>
      </View>

      <Row>
        <SearchBar value={search} onChange={setSearch} />
      </Row>

      <Card style={styles.body}>
          {loading ? (
            <Animated.View style={{ transform: [{ scale: scaleAnim }], marginTop: 20 }}>
              <ActivityIndicator size="large" color="#15ACCD" />
            </Animated.View>
          ) : selectedMission ? (
          <View>
            <Text style={styles.missionTitle}>{selectedMission.title}</Text>
            <Text style={styles.missionContent}>{selectedMission.description}</Text>
            <TouchableOpacity onPress={() => setSelectedMission(null)}>
              <Text style={styles.back}>← Retour à la liste</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredMissions}
            contentContainerStyle={[styles.gridgap, styles.list]}
            renderItem={({ item }) => (
              <Pressable onPress={() => setSelectedMission(item)}>
                <MissionCard
                  id={item.id}
                  title={item.title}
                  description={item.description}
                  style={{ flex: 1 }}
                />
              </Pressable>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </Card>

      {isAdmin && (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.floatingButton}
        >
          <Text style={styles.floatingButtonText}>+</Text>
        </TouchableOpacity>
      )}

      {/* MODAL AJOUT MISSION */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalWrapper}
        >
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              <Text style={styles.modalTitle}>Ajouter une mission</Text>

              <TextInput
                style={styles.input}
                placeholder="Titre"
                placeholderTextColor="#075B7A99"
                value={newTitle}
                onChangeText={setNewTitle}
              />

              <TextInput
                style={[styles.input, { height: 100, textAlignVertical: "top" }]}
                placeholder="Description"
                placeholderTextColor="#075B7A99"
                value={newDescription}
                onChangeText={setNewDescription}
                multiline
              />
              <TextInput
                style={styles.input}
                placeholder="Date de début (YYYY-MM-DD)"
                placeholderTextColor="#075B7A99"
                value={dateDebut}
                onChangeText={setDateDebut}
              />
              <TextInput
                style={styles.input}
                placeholder="Date de fin (YYYY-MM-DD)"
                placeholderTextColor="#075B7A99"
                value={dateFin}
                onChangeText={setDateFin}
              />
              <TextInput
                style={styles.input}
                placeholder="Statut (ouverte / fermé)"
                placeholderTextColor="#075B7A99"
                value={statutMission}
                onChangeText={setStatutMission}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={addMission} style={styles.modalButtonConfirm}>
                  <Text style={{ color: "#fff" }}>Ajouter</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButtonCancel}>
                  <Text style={{ color: "#000" }}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* BARRE DE MENU */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => router.push("/Profile")}>
          <FontAwesome name="user" size={24} color="#075B7A" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/Accueil")}>
          <FontAwesome name="home" size={24} color="#075B7A" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/Articles")}>
          <FontAwesome name="book" size={24} color="#075B7A" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/Evenement")}>
          <FontAwesome name="calendar" size={24} color="#075B7A" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
  },
  logo: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: "center",
  },
    title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    marginLeft: 12,
  },
  addButton: {
    backgroundColor: "#15ACCD",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  body: {
    flex: 1,
    marginTop: 16,
  },
  gridgap: {
    gap: 8,
  },
  list: {
    padding: 12,
  },
  missionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  missionContent: {
    fontSize: 16,
    lineHeight: 22,
  },
  back: {
    color: "#007AFF",
    marginTop: 20,
    fontSize: 16,
  },
  bottomBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    paddingVertical: 12, 
    backgroundColor: '#9BE0F1', 
    borderRadius: 20, 
    marginTop: 10 },
  modalWrapper: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButtonConfirm: {
    backgroundColor: "#15ACCD",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  modalButtonCancel: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
    floatingButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#15ACCD",
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  floatingButtonText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: -2,
  }
});
