import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { useState } from 'react'
import { View, Text, Modal, KeyboardAvoidingView, Platform, TouchableOpacity, FlatList, TextInput } from 'react-native'
import { styles } from '@/styles/feed.styles'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { COLORS } from '@/constants/theme'
import Loader from './Loader'
import Comment from './Comment'

type CommentsProps = {
  postId: Id<"posts">
  visible: boolean
  onClose: () => void
  onCommentAdded: () => void
}

export default function CommentsModal({postId, visible, onClose, onCommentAdded}: CommentsProps) {
  const [newComment, setNewComment] = useState('')
  const comments = useQuery(api.comments.getComments, {postId})
  const addComment = useMutation(api.comments.addComment)

  const handleComment = async () => {
    if(!newComment.trim()) return
    try {
      await addComment({postId, content: newComment!})
      setNewComment('')
      onCommentAdded()
    } catch (error) {
      console.log("Error ao adicionar comentário", error)
    }
  }
  return (
    <Modal visible={visible} animationType='slide' transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome name="close" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Comments</Text>
            <View style={{width: 24}} />
          </View>
          {
            !comments ? (<Loader />) : (
              <FlatList 
                data={comments}
                keyExtractor={item => item._id}
                renderItem={({item}) => <Comment comment={item as any} />}
                contentContainerStyle={styles.commentsList}
              />
            )
          }
        <View style={styles.commentInput}>
          <TextInput
            style={styles.input}
            placeholder='Escreva um comentário...'
            placeholderTextColor={COLORS.grey}
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity onPress={handleComment} disabled={!newComment.trim()}>
            <Text style={[styles.postButton, !newComment.trim() && styles.postButtonDisabled]}>
              Enviar
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}