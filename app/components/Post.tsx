import { View, Text, TouchableOpacity } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import {styles} from '../../styles/feed.styles'
import { Link } from 'expo-router'
import { Image } from 'expo-image'
import { COLORS } from '@/constants/theme'
import { useState } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import CommentsModal from './CommentsModal'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useUser } from '@clerk/clerk-expo'

type PostProps = {
  _id: Id<"posts">;
  imageUrl: string;
  caption?: string;
  likes: number;
  comments: number;
  _creationTime: number;
  isBookmarked: boolean;
  isLiked: boolean;
  author: {
    id: string;
    image: string;
    userName: string;
  };
}

export default function Post({post}: {post: PostProps}) {
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked)
  const [likesCount, setLikesCount] = useState(post.likes)
  const [commetsCount, setCommetsCount] = useState(post.comments)
  const [showComments, setShowComments] = useState(false)

  const {user} = useUser()
  const currentUser = useQuery(api.user.getUserByClerkId, user ? {clerkId: user.id} : 'skip')

  const toogleLike = useMutation(api.post.toggleLike)
  const toogleBookmark = useMutation(api.bookmark.toggleBookmark)
  const deletePost = useMutation(api.post.deletePost)

  const handleLike = async () => {
    try {
      const newLiked = await toogleLike({postId: post._id})
      setIsLiked(newLiked)
      setLikesCount( prev => (newLiked ? prev + 1 : prev - 1))
    } catch (error) {
      console.log("Error ao tooglar like", error)
    }
  }

  const handleBookmark = async () => {
    const newBookmarked = await toogleBookmark({postId: post._id})
    setIsBookmarked(newBookmarked)
  }

  const handleDelete = async () => {
    try {
      await deletePost({postId: post._id})
    } catch (error) {
      console.log("Error ao deletar post", error)
    }
  }
  return (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <Link href={'/(tabs)/notification'}>
          <TouchableOpacity style={styles.postHeaderLeft}>
            <Image 
              style={styles.postAvatar}
              source={{uri: post.author.image}} 
              contentFit='cover'
              transition={200}
              cachePolicy="memory-disk"
             />
             <Text style={styles.postUsername}>{post.author.userName}</Text>
          </TouchableOpacity>
        </Link>
        {
          post.author.id === currentUser?._id 
          ? (
              <TouchableOpacity onPress={handleDelete}>
                <FontAwesome name='trash-o' size={20} color={COLORS.primary} />
              </TouchableOpacity>
             )
            : (
              <TouchableOpacity>
                <FontAwesome name='ellipsis-h' size={20} color={COLORS.white} />
              </TouchableOpacity>
            )
        }
      </View>
      <Image 
        style={styles.postImage}
        source={{uri: post.imageUrl}} 
        contentFit='cover'
        transition={200}
        cachePolicy="memory-disk"
      />
      <View style={styles.postActions}>
        <View  style={styles.postActionsLeft}>
          <TouchableOpacity onPress={handleLike}>
            <FontAwesome 
              name={`heart${isLiked ? '' : '-o'}`} 
              size={22} 
              color={isLiked ? COLORS.primary : COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowComments(true)}>
            <FontAwesome name='comment-o' size={22} color={COLORS.white} />
          </TouchableOpacity>
        </View>
          <TouchableOpacity onPress={handleBookmark}>
            <FontAwesome name={`bookmark${isBookmarked ? '' : '-o'}`} size={22} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <View style={styles.postInfo}>
        <Text style={styles.likesText}>{
          likesCount > 0 ? `${likesCount} curtidas` : 'Seja o primeiro a curtir'
        }</Text>
          
          {commetsCount > 0 
            ? (<>
                  <TouchableOpacity onPress={() => setShowComments(true)}>
                    <Text style={styles.commentsText}>Veja todos {commetsCount} comentarios</Text>
                  </TouchableOpacity>
                  <Text style={styles.timeAgo}>
                    {formatDistanceToNow(post._creationTime,{addSuffix: true, locale: ptBR })}
                  </Text>
               </>)
            : <Text style={styles.commentsText}>Seja o primeiro a comentar</Text>
          }
        </View>
        <CommentsModal 
          postId={post._id}
          visible={showComments}
          onClose={() => setShowComments(false)}
          onCommentAdded={() =>  setCommetsCount(prev => prev + 1)}
        />
    </View>
  )
}