import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./user";

export const toggleBookmark = mutation({
  args: {postId: v.id("posts")},
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx)
    const existed =   await ctx.db.query("bookmarks")
      .withIndex("by_user_and_post", q => q.eq("userId", currentUser._id).eq("postId", args.postId))
      .first()
    if(existed) {
      await ctx.db.delete(existed._id)
      return false
    }else {
      await ctx.db.insert("bookmarks", {
        userId: currentUser._id,
        postId: args.postId
      })
      return true
    }
  }
})

export const getBookmarkedPosts = query({
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx)
    const bookmarkedPosts = await ctx.db.query("bookmarks")
      .withIndex("by_user", q => q.eq("userId", currentUser._id))
      .order('desc')
      .collect()
    const bookmarksWithInfo = await Promise.all(
      bookmarkedPosts.map(async (bookmark) => ctx.db.get(bookmark.postId))
    )
    return bookmarksWithInfo
  }
})