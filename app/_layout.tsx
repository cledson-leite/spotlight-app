import { COLORS } from "@/constants/theme";
import { Stack } from "expo-router";
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import InitialLayout from "./components/initial-layout";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeAreaProvider>
        <SafeAreaView  style={{ flex: 1, backgroundColor: COLORS.background }}>
            <InitialLayout />
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkProvider>
  );
}
