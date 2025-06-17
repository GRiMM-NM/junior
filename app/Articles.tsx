import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
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
import { Card } from "./../components/Card";
import { Row } from "./../components/Row";
import { SearchBar } from "./../components/SearchBar";
import { ThemedeText } from "./../components/ThemedText";
import { useThemeColors } from "./../hooks/useThemeColor";

interface ArticleItem {
  id: string;
  title: string;
  content: string;
  author?: string;
  date?: string;
}

export default function Articles() {
  const colors = useThemeColors();
  const router = useRouter();
  
  const [isAdmin, setIsAdmin] = useState(false);

  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newAuthor, setNewAuthor] = useState("");

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
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("http://172.20.10.13:5001/juniorfirebase-d7603/us-central1/getArticle");
        const data = await response.json();
        const formattedArticles: ArticleItem[] = data.article.map((item: any) => ({
          id: item.Id_article,
          title: item.nom_article,
          content: item.contenu,
          author: item.auteur,
          date: item.date_publication,
        }));
        setArticles(formattedArticles);
      } catch (error) {
        console.error("Erreur lors du chargement des articles :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(search.toLowerCase())
  );

  const addArticle = async () => {
    if (newTitle.trim() && newContent.trim() && newAuthor.trim()) {
      try {
        const response = await fetch("http://172.20.10.13:5001/juniorfirebase-d7603/us-central1/addArticle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nom_article: newTitle,
            contenu: newContent,
            auteur: newAuthor,
          }),
        });

        if (!response.ok) {
          throw new Error("Échec de l’ajout de l’article");
        }

        const data = await response.json();
        console.log("Article ajouté :", data);

        setArticles((prev) => [
          {
            id: "temp-" + Date.now(),
            title: newTitle,
            content: newContent,
            author: newAuthor,
            date: new Date().toISOString(),
          },
          ...prev,
        ]);

        setNewTitle("");
        setNewContent("");
        setNewAuthor("");
        setModalVisible(false);
      } catch (error) {
        console.error("Erreur lors de l’ajout de l’article :", error);
      }
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.tint }]}>
      <View style={styles.header}>
        <ThemedeText variant="subtitle2" style={styles.title} color={"grayWhite"}>
          Articles
        </ThemedeText>
      </View>

      <Row>
        <SearchBar value={search} onChange={setSearch} />
      </Row>

      <Card style={styles.body}>
        {loading ? (
          <ActivityIndicator size="large" color="#15ACCD" style={{ marginTop: 20 }} />
        ) : selectedArticle ? (
          <View>
            <Text style={styles.articleTitle}>{selectedArticle.title}</Text>
            <Text style={styles.articleContent}>{selectedArticle.content}</Text>
            {selectedArticle.author && (
              <Text style={{ fontStyle: "italic", marginTop: 8 }}>
                Par {selectedArticle.author}, publié le{" "}
                {new Date(selectedArticle.date || "").toLocaleDateString()}
              </Text>
            )}
            <TouchableOpacity onPress={() => setSelectedArticle(null)}>
              <Text style={styles.back}>← Retour à la liste</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredArticles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable onPress={() => setSelectedArticle(item)} style={styles.articleItem}>
                <Text style={styles.articleTitle}>{item.title}</Text>
              </Pressable>
            )}
          />
        )}
      </Card>

      {isAdmin && (
        <Animated.View style={[styles.floatingButton, { transform: [{ scale: scaleAnim }] }]}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

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
                placeholderTextColor="#075B7A99"
                value={newTitle}
                onChangeText={setNewTitle}
              />
              <TextInput
                style={[styles.input, { height: 100, textAlignVertical: "top" }]}
                placeholder="Contenu"
                placeholderTextColor="#075B7A99"
                value={newContent}
                onChangeText={setNewContent}
                multiline
              />
              <TextInput
                style={styles.input}
                placeholder="Auteur"
                placeholderTextColor="#075B7A99"
                value={newAuthor}
                onChangeText={setNewAuthor}
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
    padding: 12,
  },
  header: {
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
    paddingTop: Platform.OS === "ios" ? 40 : 20,
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
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    backgroundColor: "#9BE0F1",
    borderRadius: 20,
    marginTop: 10,
  },
  floatingButton: {
    position: "absolute",
    bottom: 115,
    right: 20,
    backgroundColor: "#15ACCD",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
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
