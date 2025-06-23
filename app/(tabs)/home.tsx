import { styles } from "@/styles/feed.styles";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { COLORS } from "@/constants/theme";
import { STORIES } from "@/constants/mock-data";
import Stories from "../components/Stories";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import NoPostFound from "../components/NoPostFound";
import Loader from "../components/Loader";
import Post from "../components/Post";


export default function Home() {
  const {signOut} = useAuth()
  const {user} = useUser()
  const username = user?.emailAddresses[0]?.emailAddress?.split('@')[0]
  const posts = useQuery(api.post.getFeedPost)

  if(posts === undefined) return <NoPostFound />
  if(posts.length === 0) return <Loader />
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Spotlight</Text>
        <TouchableOpacity onPress={() =>signOut()}>
          <FontAwesome name="sign-out" size={24} color={COLORS.white}/>
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 60}}>
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
        {
          posts.map(post => (
            <Post key={post._id} post={post} />
          ))
        }
      </ScrollView>
    </View>
  );
}
