
import AideScreen from '@/app/AideScreen';
import ConfidentialiteScreen from '@/app/ConfidentialiteScreen';
import DeconnexionScreen from '@/app/deconnexionScreen';
import MissionsRecemmentScreen from '@/app/HistoriqueScreen';
import { HomeScreen } from '@/app/index';
import ModifierProfilScreen from '@/app/modifierProfil';
import ProfilScreen from '@/app/Profile';
import { UserProvider } from '@/UserContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



export type RootStackParamList = {
  Home: undefined;
  Mdp_oublie: undefined;
  Page_inscription: undefined;
  Accueil: undefined;
  Profile: undefined;
  ModifierProfil : undefined;
  MissionsRecemment : undefined;
  Confidentialite : undefined;
  Deconnexion : undefined;
  Aide : undefined;
  Tabs: undefined;
  menu: undefined;
};

const Stack = createNativeStackNavigator();


export function RootNavigator(){
    return (
        <UserProvider>
            <Stack.Navigator screenOptions={{headerShown: false,}} initialRouteName='Home'>
                <Stack.Screen name="Home" component={HomeScreen}/>
                <Stack.Screen name="Profile" component={ProfilScreen}/>
                <Stack.Screen name="ModifierProfil" component={ModifierProfilScreen} />
                <Stack.Screen name="MissionsRecemment" component={MissionsRecemmentScreen} />
                <Stack.Screen name="Confidentialite" component={ConfidentialiteScreen} />
                <Stack.Screen name="Aide" component={AideScreen} />
                <Stack.Screen name="Deconnexion" component={DeconnexionScreen} />
            </Stack.Navigator>
        </UserProvider>

    )
}