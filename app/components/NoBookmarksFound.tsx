import { View, Text } from 'react-native'
import { COLORS } from '@/constants/theme'

export default function NoBookmarksFound() {
  return (
    <View 
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Text
        style={{ fontSize: 20, color: COLORS.primary }}
      >
        Nenhum Poste foi salvo
      </Text>
    </View>
  )
}