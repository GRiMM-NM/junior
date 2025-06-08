import { Card } from "@/components/Card";
import { Row } from "@/components/Row";
import { SearchBar } from "@/components/SearchBar";
import { ThemedeText } from "@/components/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
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

interface ArticleItem {
  id: number;
  title: string;
  content: string;
}

export default function Articles() {
  const colors = useThemeColors();
  const router = useRouter();

  const [articles, setArticles] = useState<ArticleItem[]>([
    { id: 1, title: "Climat et Energie", content: "Contenu détaillé sur le climat." },
    { id: 2, title: "Intelligence Artificielle", content: "L'IA bouleverse notre société." },
    { id: 3, title: "Espace et exploration", content: "Mars, la prochaine étape ?" },
  ]);

  const [search, setSearch] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(search.toLowerCase())
  );

  const addArticle = () => {
    if (newTitle.trim() && newContent.trim()) {
      const newArticle: ArticleItem = {
        id: articles.length + 1,
        title: newTitle,
        content: newContent,
      };
      setArticles([newArticle, ...articles]);
      setNewTitle("");
      setNewContent("");
      setModalVisible(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.tint }]}>
      <Row style={styles.header}>
        <ThemedeText variant="subtitle2" style={styles.title}>
          Articles
        </ThemedeText>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </Row>

      <Row>
        <SearchBar value={search} onChange={setSearch} />
      </Row>

      <Card style={styles.body}>
        {selectedArticle ? (
          <View>
            <Text style={styles.articleTitle}>{selectedArticle.title}</Text>
            <Text style={styles.articleContent}>{selectedArticle.content}</Text>
            <TouchableOpacity onPress={() => setSelectedArticle(null)}>
              <Text style={styles.back}>← Retour à la liste</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredArticles}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable onPress={() => setSelectedArticle(item)} style={styles.articleItem}>
                <Text style={styles.articleTitle}>{item.title}</Text>
              </Pressable>
            )}
          />
        )}
      </Card>

      {/* Modal pour ajouter un article */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalWrapper}
        >
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              <Text style={styles.modalTitle}>Ajouter un article</Text>
              <TextInput
                style={styles.input}
                placeholder="Titre"
                value={newTitle}
                onChangeText={setNewTitle}
              />
              <TextInput
                style={[styles.input, { height: 100, textAlignVertical: "top" }]}
                placeholder="Contenu"
                value={newContent}
                onChangeText={setNewContent}
                multiline
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={addArticle} style={styles.modalButtonConfirm}>
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

      {/* Barre de menu */}
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
    padding: 12,
  },
  header: {
    marginBottom: 12,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
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
    marginTop: 8,
    padding: 12,
  },
  articleItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  articleContent: {
    fontSize: 16,
    marginTop: 10,
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
