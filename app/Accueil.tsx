import { Card } from "@/components/Card";
import { ThemedeText } from "@/components/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
    const colors = useThemeColors()
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.tint}]}>
      <Card>
        <ThemedeText variant="headline" color="darkBlue">Mission Disponibles</ThemedeText>
      </Card>  
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{flex : 1 }
}) 