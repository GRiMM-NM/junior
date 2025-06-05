
import { UserProvider } from '@/UserContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import Accueil from '@/app/Accueil';
import AideScreen from '@/app/AideScreen';
import { HomeScreen } from '@/app/index';
import ProfilScreen from '@/app/Profile';
import ConfidentialiteScreen from '@/app/tabs/profileSreens/ConfidentialitéScreen';
import DeconnexionScreen from '@/app/tabs/profileSreens/deconnexionScreen';
import MissionsRecemmentScreen from '@/app/tabs/profileSreens/HistoriqueScreen';
import ModifierProfilScreen from '@/app/tabs/profileSreens/modifierProfil';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';



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
};

export type TabParamList = {
  Accueil: undefined;
  Evénements: undefined;
  Articles: undefined;
  Profil: undefined;
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator<TabParamList>();

function Tabs(){
    return(
        <NavigationContainer>
        <Tab.Navigator screenOptions={{headerShown: false}}>
            <Tab.Screen         
            name="Accueil"
            component={Accueil}
            options={{
                tabBarIcon: ({ color, size, focused }) => <Text style={{ fontSize: size,opacity: focused ? 1 : 0.4 }}>🏠</Text>,
            }}/>
            <Tab.Screen         
            name="Evénements"
            component={ProfilScreen}
            options={{
                tabBarIcon: ({ color, size, focused }) => <Text style={{ fontSize: size,opacity: focused ? 1 : 0.4 }}>📅</Text>,
            }}/>
            <Tab.Screen         
            name="Articles"
            component={ProfilScreen}
            options={{
                tabBarIcon: ({ color, size, focused }) => <Text style={{ fontSize: size,opacity: focused ? 1 : 0.4 }}>📰</Text>,
            }}/>
            <Tab.Screen         
            name="Profil"
            component={ProfilScreen}
            options={{
                tabBarIcon: ({ color, size, focused }) => <Text style={{ fontSize: size,opacity: focused ? 1 : 0.4 }}>👤</Text>,
            }}/>                           
        </Tab.Navigator>
        </NavigationContainer>
    )
}


export function RootNavigator(){
    return (
        <UserProvider>
            <Stack.Navigator screenOptions={{headerShown: false,}} initialRouteName='Home'>
                <Stack.Screen name="Home" component={HomeScreen}/>
                <Stack.Screen name="Tabs" component={Tabs} /> 
                <Stack.Screen name="Profile" component={ProfilScreen}/>
             {/*<Stack.Screen name="Accueil" component={Accueil}/>*/}
                <Stack.Screen name="ModifierProfil" component={ModifierProfilScreen} />
                <Stack.Screen name="MissionsRecemment" component={MissionsRecemmentScreen} />
                <Stack.Screen name="Confidentialite" component={ConfidentialiteScreen} />
                <Stack.Screen name="Aide" component={AideScreen} />
                <Stack.Screen name="Deconnexion" component={DeconnexionScreen} />
            </Stack.Navigator>
        </UserProvider>

    )
}