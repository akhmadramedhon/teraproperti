// convex/houseAdsPayments.js
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// 1️⃣ User membayar untuk iklan rumah
export const createHouseAdPayment = mutation({
  args: {
    house_id: v.id("houses"),
    user_id: v.id("users"),
    payment_url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("house_ads_payments", {
      ...args,
      status: "pending",
      created_at: new Date().toISOString()
    });
  }
});

// 2️⃣ Update status pembayaran iklan rumah
export const updatePaymentStatus = mutation({
  args: {
    payment_id: v.id("house_ads_payments"),
    status: v.string(), // paid, failed, etc.
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.payment_id, {
      status: args.status,
    });
  }
});

// 3️⃣ Ambil data pembayaran untuk user tertentu
export const getUserHouseAdsPayments = query({
  args: {
    user_id: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("house_ads_payments")
      .filter((q) => q.eq(q.field("user_id"), args.user_id))
      .collect();
  }
});

// Ambil pembayaran iklan berdasarkan house_id
export const getPaymentByHouseId = query({
  args: {
    house_id: v.id("houses"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("house_ads_payments")
      .filter((q) => q.eq(q.field("house_id"), args.house_id))
      .first();
  },
});