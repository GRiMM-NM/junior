import { Card } from "@/components/Card";
import { MissionCard } from "@/components/Mission/MissionCard";
import { Row } from "@/components/Row";
import { SearchBar } from "@/components/SearchBar";
import { ThemedeText } from "@/components/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { useState } from "react";
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Accueil() {
  const router = useRouter();
  const colors = useThemeColors();
  const mission = Array.from({ length: 15 }, (_, k) => ({
    title: 'Mission',
    id: k + 1,
    description: 'description',
  }));
  const [Search, setSearch] = useState('');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.tint }]}>
      <Row style={styles.header} gap={16}>
        <Image source={require("@/assets/images/EPF_Projets_Logo.png")} style={styles.logo} />
        <ThemedeText variant="headline" color="grayWhite">Mission Disponibles</ThemedeText>
      </Row>
      <Row>
        <SearchBar value={Search} onChange={setSearch} />
      </Row>
      <Card style={styles.body}>
        <FlatList
          data={mission}
          contentContainerStyle={[styles.gridgap, styles.list]}
          renderItem={({ item }) =>
            <MissionCard
              id={item.id}
              title={item.title}
              description={item.description}
              style={{ flex: 1 }}
            />
          }
          keyExtractor={(item) => item.id.toString()}
        />
      </Card>

      {/* BARRE DE MENU */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => router.push('/Profile')}>
          <FontAwesome name="user" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/Accueil')}>
          <FontAwesome name="home" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/Articles')}>
          <FontAwesome name="book" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/Evenement')}>
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
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 8,
    paddingTop: 8,
  },
});
