import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    username: v.string(),
    fullname: v.string(),
    image: v.string(),
    bio: v.optional(v.string()),
    email: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db.query("users").withIndex("by_clerk_id", q => q.eq("clerkId", args.clerkId)).first()
    if(existingUser) return
    await ctx.db.insert("users", {
      username: args.username,
      fullname: args.fullname,
      image: args.image,
      bio: args.bio,
      email: args.email,
      clerkId: args.clerkId,
      followers: 0,
      following: 0,
      posts: 0
    })
  }
})

export const getAuthenticatedUser = async (ctx: QueryCtx | MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) throw new Error("Não autorizado")

  const currentUser = await ctx.db.query('users')
    .withIndex( 'by_clerk_id', (q: any) => q.eq('clerkId', identity.subject))
    .first()
  
  if(!currentUser) throw new Error("Usuário não encontrado")

    return currentUser
}

export const getUserByClerkId = query({
  args: {clerkId: v.string()},
  handler: async (ctx, args) => ctx.db.query('users')
      .withIndex( 'by_clerk_id', (q: any) => q.eq('clerkId', args.clerkId))
      .unique()
})