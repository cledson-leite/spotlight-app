import { View, Text, Image } from 'react-native'
import {formatDistanceToNow} from 'date-fns'
import {ptBR} from 'date-fns/locale'
import { styles } from '@/styles/feed.styles'
type CommentProps = {
  content: string
  _creationTime: number
  user: {
    image: string
    fullname: string
  }
}

export default function Comment({comment}: {comment: CommentProps}) {
  return (
    <View style={styles.commentContainer}>
      <Image source={{uri: comment.user.image}} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <Text style={styles.commentUsername}>{comment.user.fullname}</Text>
        <Text style={styles.commentText}>{comment.content}</Text>
        <Text style={styles.commentTime}>{
          formatDistanceToNow(
            comment._creationTime,
            {addSuffix: true, locale: ptBR }
          )
        }</Text>
      </View>
    </View>
  )
}