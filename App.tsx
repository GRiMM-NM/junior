import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import { RootNavigator } from "./navigation/RootNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}