import { Card } from "@/components/Card";
import { MissionCard } from "@/components/Mission/MissionCard";
import { Row } from "@/components/Row";
import { SearchBar } from "@/components/SearchBar";
import { ThemedeText } from "@/components/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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

interface Mission {
  id: number;
  title: string;
  description: string;
}

export default function Accueil() {
  const router = useRouter();
  const colors = useThemeColors();

  const [missions, setMissions] = useState<Mission[]>(
    Array.from({ length: 15 }, (_, k) => ({
      title: `Mission ${k + 1}`,
      id: k + 1,
      description: `Description détaillée de la mission ${k + 1}`,
    }))
  );

  const [search, setSearch] = useState("");
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const filteredMissions = missions.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  const addMission = () => {
    if (newTitle.trim() && newDescription.trim()) {
      const newMission: Mission = {
        id: missions.length + 1,
        title: newTitle,
        description: newDescription,
      };
      setMissions([newMission, ...missions]);
      setNewTitle("");
      setNewDescription("");
      setModalVisible(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.tint }]}>
      <Row style={styles.header} gap={16}>
        <Image
          source={require("@/assets/images/EPF_Projets_Logo.png")}
          style={styles.logo}
        />
        <ThemedeText variant="headline" color="grayWhite" style={{ flex: 1 }}>
          Missions Disponibles
        </ThemedeText>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </Row>

      <Row>
        <SearchBar value={search} onChange={setSearch} />
      </Row>

      <Card style={styles.body}>
        {selectedMission ? (
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
                value={newTitle}
                onChangeText={setNewTitle}
              />
              <TextInput
                style={[styles.input, { height: 100, textAlignVertical: "top" }]}
                placeholder="Description"
                value={newDescription}
                onChangeText={setNewDescription}
                multiline
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
          <FontAwesome name="user" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/Accueil")}>
          <FontAwesome name="home" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/Articles")}>
          <FontAwesome name="book" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/Evenement")}>
          <FontAwesome name="calendar" size={24} color="black" />
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 8,
    paddingTop: 8,
  },
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
});
