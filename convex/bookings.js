// convex/bookings.js
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// 1️⃣ User booking konsultan untuk rumah tertentu
export const createBooking = mutation({
  args: {
    buyer_id: v.id("users"),
    house_id: v.id("houses"),
    consultant_id: v.id("consultants"),
    payment_url: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("bookings", {
      ...args,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
});

// 2️⃣ Update status booking (misal setelah bayar atau selesai)
export const updateBookingStatus = mutation({
  args: {
    booking_id: v.id("bookings"),
    status: v.string(), // paid, completed, cancelled, dll
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.booking_id, {
      status: args.status,
      updated_at: new Date().toISOString(),
    });
  }
});

// 3️⃣ Tambahkan feedback setelah selesai
export const giveFeedback = mutation({
  args: {
    booking_id: v.id("bookings"),
    feedback: v.string(),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.booking_id, {
      feedback: args.feedback,
      rating: args.rating,
      updated_at: new Date().toISOString()
    });
  }
});

// 4️⃣ Ambil semua booking untuk user tertentu
export const getBookingsByUser = query({
  args: {
    buyer_id: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("bookings")
      .filter((q) => q.eq(q.field("buyer_id"), args.buyer_id))
      .collect();
  }
});
