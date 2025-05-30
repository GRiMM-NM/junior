import { useThemeColors } from "@/hooks/useThemeColor";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { Card } from "../Card";
import { ThemedeText } from "../ThemedText";

type Props = {
    style? : ViewStyle,
    id: number,
    title: string,
    description: string,
}

export function MissionCard({style, id, title, description}: Props){
    const colors = useThemeColors()
    return <Card style  ={[style, styles.card]}>
        <ThemedeText  style = {styles.id} variant="caption" color="tint">#{id.toString().padStart(3,'0')}</ThemedeText>
        <ThemedeText variant="headline" color="black">{title} {id.toString()}</ThemedeText>
        <ThemedeText color="black">{description}</ThemedeText>
        <View style={[styles.shadow, {backgroundColor: colors.BlueLight}]}/>
    </Card>
}

const styles =StyleSheet.create({
    card: {
        position:   'relative',
        alignItems: 'flex-start',
        padding: 4
    },

    id:{
        alignSelf : 'flex-end'
    },
    shadow:{
        bottom: 5,
        marginTop:12,
        left: '50%',
        width: 300, 
        height: 8,
        borderRadius: 10,
        transform: [{ translateX: -150 }] // -width / 2 pour centrer    
    }
})