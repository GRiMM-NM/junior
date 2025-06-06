import { UserProvider } from "@/UserContext"; // Assure-toi que ce chemin est correct
import { Stack } from "expo-router";

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

