import { styles } from "@/styles/feed.styles";
import { useAuth } from "@clerk/clerk-expo";
import { FlatList, Text, TouchableOpacity, View } from "react-native"
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { COLORS } from "@/constants/theme";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import NoPostFound from "../components/NoPostFound";
import Post from "../components/Post";
import StoriesSaction from "../components/StoriesSaction";
import Loader from "../components/Loader";


export default function HomeScreen() {
  const {signOut} = useAuth()
  const posts = useQuery(api.post.getFeedPost)
  if(posts === undefined ) return <Loader />
  if(posts.length === 0) return <NoPostFound />
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Spotlight</Text>
        <TouchableOpacity onPress={() =>signOut()}>
          <FontAwesome name="sign-out" size={24} color={COLORS.white}/>
        </TouchableOpacity>
      </View>
      <FlatList 
        data={posts}
        renderItem={({item}) => <Post post={item} />}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 60}}
        ListHeaderComponent={<StoriesSaction />}
      />
    </View>
  );
}
