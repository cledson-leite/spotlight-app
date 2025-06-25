import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Loader from '../components/Loader'
import NoBookmarksFound from '../components/NoBookmarksFound'
import { styles } from '@/styles/feed.styles'
import { Image } from 'expo-image'

export default function BookmarksScreen() {
  const bookmarkedsPosts = useQuery(api.bookmark.getBookmarkedPosts)
  if(bookmarkedsPosts === undefined ) return <Loader />
  if(bookmarkedsPosts.length === 0) return <NoBookmarksFound />
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Salvos</Text>
      </View>
      <ScrollView
        contentContainerStyle={{
          padding: 8,
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        {
          bookmarkedsPosts.map(post => {
            if(!post) return null
            return (
              <View style={{width: '33.33%', padding: 1}} key={post._id}>
                <Image 
                  source={{uri: post.imageUrl}} 
                  style={{width: '100%', aspectRatio: 1}}
                  contentFit='cover'
                  transition={200}
                  cachePolicy="memory-disk"
                />
              </View>
            )
          })
        }
      </ScrollView>
    </View>
  )
}