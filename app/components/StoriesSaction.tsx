import { ScrollView } from 'react-native'
import React from 'react'
import { styles } from '@/styles/feed.styles'
import Stories from './Stories'
import { useUser } from "@clerk/clerk-expo";
import { STORIES } from '@/constants/mock-data';

export default function StoriesSaction() {
  const {user} = useUser()
  const username = user?.emailAddresses[0]?.emailAddress?.split('@')[0]
  return (
    <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          style={styles.storiesContainer}
        >
          <Stories key={user?.id} story={{
            id: user?.id ? user.id : "",
            username: username ? username : "", 
            avatar: user?.imageUrl ? user.imageUrl : "", 
            hasStory: false
            }} />
          {
            STORIES.map(story => (
              <Stories key={story.id} story={story} />
            ))
          }
        </ScrollView>
  )
}