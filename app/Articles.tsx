import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Article(){
    const router = useRouter();
    return(
        <SafeAreaView>
            <View>
                <Text>Article</Text>
            </View>
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
    )
}

const styles = StyleSheet.create({
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
})
