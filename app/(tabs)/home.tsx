import { styles } from "@/styles/auth-style";
import { useAuth } from "@clerk/clerk-expo";
import { Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const {signOut} = useAuth()
  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => signOut()}>
          <Text style={{color: 'white'}}>Sair</Text>
        </TouchableOpacity>
    </View>
  );
}
