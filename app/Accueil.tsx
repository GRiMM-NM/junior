import { Card } from "@/components/Card";
import { ThemedeText } from "@/components/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Text } from "@react-navigation/elements";
import { FlatList, Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
    const colors = useThemeColors()
    const mission = Array.from({length:20},(_,k)=> ({
      title : 'Nom Mission',
      id: k+1,
      description : 'description' 
    }))
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.tint}]}>
      <View style={styles.header}>
        <Image source={require("@/assets/images/favicon.png")} style={styles.logo}/>
        <ThemedeText variant="headline" color="grayWhite">Mission Disponibles</ThemedeText>
      </View>
      <Card style={styles.body}>
        <FlatList 
        data={mission} 
        contentContainerStyle={[styles.gridgap, styles.list]}
        renderItem={({item})=> <Card style={{flex:1, height: 195}}>
          <Text>{item.title}</Text>
          <Text>{item.description}</Text>
        </Card>} keyExtractor={(item)=>item.id.toString()}/>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex : 1 , 
    padding: 4
  },
  logo: { 
    width: 32, 
    height: 32,
    resizeMode: "contain",
  },
  header:{
    flexDirection : 'row',
    alignItems: 'center',
    gap : 16,
    padding: 12,
    justifyContent: "center",
  },
  body: {
    flex : 1,
  },
  gridgap:{
    gap:8,
  },
  list:{
    padding : 12,
  }
}) 