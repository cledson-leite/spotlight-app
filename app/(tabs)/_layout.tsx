import { Tabs } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { COLORS } from "@/constants/theme";


export default function TabsLayout() {
  return (
    <Tabs 
      screenOptions={{
        // tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: COLORS.secondary,
        tabBarInactiveTintColor: COLORS.grey,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopWidth: 0,
          position: "absolute",
          elevation: 0,
          height: 60,
          paddingBottom: 10
        }
      }}
    >
      <Tabs.Screen 
      name="home"
      options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesome name="home" size={size} color={color} />
        ),
      }}
      />
      <Tabs.Screen 
      name="bookmarks"
      options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesome name="bookmark" size={size} color={color} />
        ),
      }}
      />
      <Tabs.Screen 
      name="create"
      options={{
        tabBarIcon: ({  size }) => (
          <FontAwesome name="plus-circle" size={size} color={COLORS.primary} />
        ),
      }}
      />
      <Tabs.Screen 
      name="notification"
      options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesome name="heart" size={size} color={color} />
        ),
      }}
      />
      <Tabs.Screen 
      name="profile"
      options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesome name="user-circle" size={size} color={color} />
        ),
      }}
      />
    </Tabs>
  )
}