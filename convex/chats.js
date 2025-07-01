// convex/chats.js
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// 1️⃣ Kirim pesan
export const sendMessage = mutation({
  args: {
    sender_id: v.id("users"),
    receiver_id: v.id("users"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("chats", {
      ...args,
      sent_at: new Date().toISOString()
    });
  }
});

// 2️⃣ Ambil riwayat chat antara dua user (A & B)
export const getChatHistory = query({
  args: {
    userA: v.id("users"),
    userB: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("chats")
      .filter((q) => q.or(
        q.and(
          q.eq(q.field("sender_id"), args.userA),
          q.eq(q.field("receiver_id"), args.userB)
        ),
        q.and(
          q.eq(q.field("sender_id"), args.userB),
          q.eq(q.field("receiver_id"), args.userA)
        )
      ))
      .order("asc")
      .collect();
  }
});

// convex/chats.js
export const getChatPartners = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const chats = await ctx.db.query("chats")
      .filter((q) => q.or(
        q.eq(q.field("sender_id"), args.userId),
        q.eq(q.field("receiver_id"), args.userId)
      ))
      .collect();

    // Ambil semua ID user yang pernah terlibat obrolan selain dirinya sendiri
    const partnerIds = new Set();
    for (const chat of chats) {
      if (chat.sender_id !== args.userId) {
        partnerIds.add(chat.sender_id);
      }
      if (chat.receiver_id !== args.userId) {
        partnerIds.add(chat.receiver_id);
      }
    }

    // Fetch detail user (hanya yang unik)
    const users = await Promise.all(
      Array.from(partnerIds).map((partnerId) =>
        ctx.db.get(partnerId)
      )
    );

    return users.filter(Boolean); // Buang null jika ada
  },
});
