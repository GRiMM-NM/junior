import { Stack } from "expo-router";
import { UserProvider } from "./../UserContext"; // Assure-toi que ce chemin est correct

export default function RootLayout() {
  return (
    <UserProvider>
      <>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </>
    </UserProvider>
  );
}

