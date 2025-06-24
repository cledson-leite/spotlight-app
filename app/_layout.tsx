import InitialLayout from "./components/initial-layout";
import Provider from "../provider";
import { SplashScreen} from 'expo-router'
import {useFonts} from 'expo-font'
import { useCallback } from "react";

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'JetBrainsMono-Medium': require('../assets/fonts/JetBrainsMono-Medium.ttf'),
  })
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) SplashScreen.hideAsync()
  }, [fontsLoaded])
  
  return (
    <Provider>
      <InitialLayout onLayout={onLayoutRootView}/>
    </Provider>
  );
}
