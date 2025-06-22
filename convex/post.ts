import { v } from "convex/values";
import { mutation } from "./_generated/server";

const valideteIdentity = async (ctx: any) => {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) throw new Error("Não autorizado")
    return identity
}

export const generateUploadUrl = mutation(async ctx => {
  valideteIdentity(ctx)
  return ctx.storage.generateUploadUrl()
})

export const createPost = mutation({
  args: {
    caption: v.optional(v.string()),
    storageId: v.id("_storage")
  },
  handler: async (ctx, args) => {
    const id = await valideteIdentity(ctx)
    const currentUser = await ctx.db.query('users')
      .withIndex( 'by_clerk_id', q => q.eq('clerkId', id.subject))
      .first()
    
    if(!currentUser) throw new Error("Usuário não encontrado")

    const imageUrl = await ctx.storage.getUrl(args.storageId)
    if(!imageUrl) throw new Error("Imagem não encontrada")

    const postId = await ctx.db.insert("posts", {
      userId: currentUser._id,
      imageUrl,
      storageId: args.storageId,
      caption: args.caption,
      likes: 0,
      comments: 0
    })

    await  ctx.db.patch(currentUser._id, {posts: currentUser.posts + 1})

    return postId
  }
})