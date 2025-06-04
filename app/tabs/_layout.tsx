import { Tabs } from "expo-router";
import { Image } from "react-native";

export default function menu(){
    return(
            <Tabs screenOptions={{headerShown : false}}>
                <Tabs.Screen name = 'Accueil'
                options={{
                    tabBarIcon:({focused, color, size}) =>
                        <Image source ={require('@/assets/images/🏠.png')}
                        style={{
                            width: size,
                            height: size,
                            opacity: focused ? 1 : 0.4
                        }}/>
                }}/>
                <Tabs.Screen name = 'Evenement'
                options={{
                    tabBarIcon:({focused, color, size}) =>
                        <Image source ={require('@/assets/images/👤.png')}
                        style={{
                            width: size,
                            height: size,
                            opacity: focused ? 1 : 0.4
                        }}/>
                }}/>
                <Tabs.Screen name = 'Articles'
                options={{
                    tabBarIcon:({focused, color, size}) =>
                        <Image source ={require('@/assets/images/📅.png')}
                        style={{
                            width: size,
                            height: size,
                            opacity: focused ? 1 : 0.4
                        }}/>
                }}/>
                <Tabs.Screen name = 'Profile'
                options={{
                    tabBarIcon:({focused, color, size}) =>
                        <Image source ={require('@/assets/images/📰.png')}
                        style={{
                            width: size,
                            height: size,
                            opacity: focused ? 1 : 0.4
                        }}/>
                }}/>
                <Tabs.Screen name = 'Connexion'
                options={{
                    tabBarIcon:({focused, color, size}) =>
                        <Image source ={require('@/assets/images/👤.png')}
                        style={{
                            width: size,
                            height: size,
                            opacity: focused ? 1 : 0.4
                        }}/>
                }}/>
          </Tabs>
    )

}