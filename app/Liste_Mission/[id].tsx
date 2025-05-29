import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function ID_mission(){
    const params = useLocalSearchParams()
    return <View>
        <Text>A propos {params.id}</Text>
    </View>
}