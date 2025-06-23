import { COLORS } from '@/constants/theme'
import { styles } from '@/styles/auth.styles'
import { useSSO } from '@clerk/clerk-expo'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useRouter } from 'expo-router'
import { View, Text, Image, TouchableOpacity } from 'react-native'

export default function Login() {
  const {startSSOFlow} = useSSO()
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    try {
      const {setActive, createdSessionId} = await startSSOFlow({strategy: "oauth_google"})
      if(!createdSessionId || !setActive) return
      setActive({session: createdSessionId})
      router.replace("/(tabs)/home")
    } catch (error) {
      console.log('Erros ao logar com google ', error)
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.brandSection}>
        <View style={styles.logoContainer}>
          <FontAwesome name="leaf" size={32} color={COLORS.primary} />
        </View>
        <Text style={styles.appName}>Spotlight</Text>
        <Text style={styles.tagline}>Não perca nada!!!</Text>
      </View>
      <View style={styles.illustrationContainer}>
        <Image 
          source={require("../../assets/images/auth-bg-2.png")} 
          style={styles.illustration}
          resizeMode='cover'
        />
      </View>
      <View style={styles.loginSection}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
          activeOpacity={0.9}
        >
          <View style={styles.googleIconContainer}>
            <FontAwesome name="google" size={20} color={COLORS.surface} />
          </View>
          <Text style={styles.googleButtonText}>Entrar com Google</Text>
        </TouchableOpacity>
        <Text style={styles.termsText}>
          Ao continuar, você concorda com nossos <Text style={{ color: COLORS.primary }}>Termos de uso</Text> e <Text style={{ color: COLORS.primary }}>Política de Privacidade</Text>
          </Text>
      </View>
    </View>
  )
}