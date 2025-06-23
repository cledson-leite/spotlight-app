import { Text, View } from 'react-native'
import React from 'react'
import { COLORS } from '@/constants/theme'

export default function NoPostFound() {
  return (
    <View
    style={{
      flex: 1,
      backgroundColor: COLORS.background,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: 20, color: COLORS.primary }}>Postes não encontrados</Text>
  </View>
  )
}