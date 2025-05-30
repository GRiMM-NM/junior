import { StyleSheet, type ViewStyle } from "react-native"
import { Card } from "../Card"
import { ThemedeText } from "../ThemedText"

type Props = {
    style? : ViewStyle,
    id: number,
    title: string,
    description: string,
}

export function MissionCard({style, id, title, description}: Props){
    return <Card style={style}>
        <ThemedeText variant="caption" color="tint">#{id.toString().padStart(3,'0')}</ThemedeText>
        <ThemedeText color="black">{title}</ThemedeText>
        <ThemedeText color="black">{description}</ThemedeText>
    </Card>
}

const styles =StyleSheet.create({

})