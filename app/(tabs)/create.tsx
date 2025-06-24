import { COLORS } from '@/constants/theme'
import { styles } from '@/styles/create.styles'
import { useUser } from '@clerk/clerk-expo'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { 
  View, 
  Text, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator, 
  ScrollView, 
  TextInput 
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

import {useMutation} from 'convex/react'
import { api } from '../../convex/_generated/api'

import {Image} from 'expo-image'

export default function CreateScreen() {
  const router = useRouter()
  const {user} = useUser()

  const [caption, setCaption] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isSharing, setIsSharing] = useState(false)

  const generateUploadUrl = useMutation(api.post.generateUploadUrl)
  const createPost = useMutation(api.post.createPost)
  const handleShare =async  () => {
    if(!selectedImage) return
    try {
      setIsSharing(true)
      const uploadUrl = await generateUploadUrl()
      const result = await FileSystem.uploadAsync(uploadUrl, selectedImage, {
        httpMethod: "POST",
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        mimeType: "image/jpeg"
      })
      if(result.status !== 200) throw new Error("Erro ao enviar imagem")
      const storageId = JSON.parse(result.body).storageId
      await createPost({storageId, caption})
      setSelectedImage(null)
      setCaption("")
      router.push("/(tabs)/home")
    } catch (error) {
      console.log('Error ao enviar imagem', error)
    } finally {
      setIsSharing(false)
    }
  }

  const imagePicker = async () => {
    const image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })
    if(image.canceled) return
    setSelectedImage(image.assets[0].uri)
  }

  if(!selectedImage) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome name="chevron-left" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nova Postagem</Text>
          <View style={{width: 20}}/>
        </View>
        <TouchableOpacity onPress={imagePicker} style={styles.emptyImageContainer}>
            <FontAwesome name="image" size={40} color={COLORS.grey} />
            <Text style={styles.emptyImageText}>Escolha uma imagem</Text>
          </TouchableOpacity>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        <View style={styles.header}>
        <TouchableOpacity 
          disabled={isSharing} 
          onPress={() => {
            setSelectedImage(null)
            setCaption('')
          }}
        >
          <FontAwesome name="close" size={20} color={isSharing ? COLORS.grey : COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nova Postagem</Text>
        <TouchableOpacity 
          style={[styles.shareButton, isSharing && styles.shareButtonDisabled]}
          disabled={isSharing || !selectedImage} 
          onPress={handleShare}
        >
            {
              isSharing ? (
                <ActivityIndicator  size='small' color={COLORS.primary} />
              ) : (
                <Text style={styles.shareText}>Compartilhar</Text>
              )
            }
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          keyboardShouldPersistTaps='handled'
          contentOffset={{y: 100, x: 0}}
        >
          <View style={[styles.content, isSharing && styles.contentDisabled]}>
            <View style={styles.imageSection}>
              <Image
                source={selectedImage} 
                style={styles.previewImage} 
                contentFit='cover'
                transition={200}
              />
              <TouchableOpacity
                style={styles.changeImageButton}
                disabled={isSharing}
                onPress={imagePicker}
              >
                <FontAwesome name="image" size={20} color={COLORS.white} />
                <Text style={styles.changeImageText}>Trocar</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputSection}>
              <View style={styles.captionContainer}>
                <Image 
                  source={user?.imageUrl}
                  style={styles.userAvatar}
                  contentFit='cover'
                  transition={200}
                />
                <TextInput 
                  style={styles.captionInput}
                  placeholder='Escreva uma legenda...'
                  placeholderTextColor={COLORS.grey}
                  multiline
                  value={caption}
                  onChangeText={setCaption}
                  editable={!isSharing}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}