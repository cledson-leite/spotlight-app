import { COLORS } from "@/constants/theme"
import { useAuth } from "@clerk/clerk-expo"
import { Stack, useRouter, useSegments } from "expo-router"
import { useEffect } from "react"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"

export default function InitialLayout({onLayout}: {onLayout: () => void}) {
  const  {isLoaded, isSignedIn} = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded) return
    const inAuthScreen = segments[0] === "(auth)"
    if (!isSignedIn && !inAuthScreen) {
      router.replace("/(auth)/login")
    } else if (isSignedIn && inAuthScreen) {
      router.replace("/(tabs)/home")
    } 
  }, [isLoaded, isSignedIn, segments, router])
  if (!isLoaded) return null
  return( 
    <SafeAreaProvider>
      <SafeAreaView  style={{ flex: 1, backgroundColor: COLORS.background }} onLayout={onLayout}>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
  </SafeAreaProvider>
    
  )
}