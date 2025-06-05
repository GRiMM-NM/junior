import { Card } from "@/components/Card";
import { MissionCard } from "@/components/Mission/MissionCard";
import { Row } from "@/components/Row";
import { SearchBar } from "@/components/SearchBar";
import { ThemedeText } from "@/components/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useState } from "react";
import { FlatList, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Accueil() {
    const colors = useThemeColors()
    const mission = Array.from({length:15},(_,k)=> ({
      title : 'Mission',
      id: k+1,
      description : 'description',
    }))
    const [Search, setSearch] = useState('')
    /*const filteredMissions = Search ? mission.filter(m =>
      m.title.toLowerCase().includes(Search.toLowerCase()) ||
      m.id.toString() === Search
    ): mission*/
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.tint}]}>
      <Row style={styles.header} gap={16}>
        <Image source={require("@/assets/images/EPF_Projets_Logo.png")} style={styles.logo}/>
        <ThemedeText variant="headline" color="grayWhite">Mission Disponibles</ThemedeText>
      </Row>
      <Row>
        <SearchBar value={Search} onChange={setSearch}/>
      </Row>
      <Card style={styles.body}>
        <FlatList 
        data={mission} // a remplacer par filteredMissions quand on aura L'API 
        contentContainerStyle={[styles.gridgap, styles.list]}
        renderItem={({item})=> <MissionCard id={item.id} title={item.title} description={item.description} style={{flex:1}}/>} keyExtractor={(item)=>item.id.toString()}/>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex : 1 , 
    padding: 4,
  },
  logo: { 
    width: 32, 
    height: 32,
    resizeMode: "contain",
  },
  header:{
    paddingHorizontal: 12,
    paddingVertical: 8, 
    justifyContent: "center",
  },
  body: {
    flex : 1,
    marginTop: 16,
  },
  gridgap:{
    gap:8,
  },
  list:{
    padding : 12,
  },
}) 