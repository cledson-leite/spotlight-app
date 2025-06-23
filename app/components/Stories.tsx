import { View, Text, TouchableOpacity } from 'react-native'
import {styles} from '../../styles/feed.styles'
import { Image } from 'expo-image'

type StoriesPros = {
  id: string
  username: string
  avatar: string
  hasStory: boolean
}

export default function Stories({story}: {story: StoriesPros}) {
  return (
    <TouchableOpacity style={styles.storyWrapper}>
      <View style={[styles.storyRing, !story.hasStory && styles.noStory]}>
        <Image source={{uri: story.avatar}} style={styles.storyAvatar} />
      </View>
      <Text style={styles.storyUsername}>{story.username}</Text>
    </TouchableOpacity>
  )
}