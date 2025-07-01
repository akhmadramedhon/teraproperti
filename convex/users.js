import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Daftar email admin
const ADMIN_EMAILS = [
  "akhmadramedhon31jl@gmail.com",
  "bubotimes@gmail.com",
];

export const saveUser = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    nik: v.string(),
    ktp_image_url: v.string(),
    role: v.union(v.literal("user"), v.literal("consultant"), v.literal("admin")),
    address: v.string(),
    phone: v.string(), 
  },
  handler: async (ctx, args) => {
    const isAdmin = ADMIN_EMAILS.includes(args.email);

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existingUser) {
      if (isAdmin && existingUser.role !== "admin") {
        await ctx.db.patch(existingUser._id, { role: "admin" });
      }

      return existingUser._id;
    }

    return await ctx.db.insert("users", {
      userId: args.userId,
      email: args.email,
      name: args.name,
      nik: args.nik,
      ktp_image_url: args.ktp_image_url,
      address: args.address,
      phone: args.phone, 
      role: isAdmin ? "admin" : args.role,
      is_verified: false,
      created_at: new Date().toISOString(),
    });
  },
});

export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .unique();
  },
});

export const getAllUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("consultant"), v.literal("admin")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { role: args.role });
  },
});

export const deleteUser = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.userId);
  },
});

export const updateUserProfile = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    nik: v.string(),
    address: v.string(),
    phone: v.string(),
    ktp_image_url: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      name: args.name,
      nik: args.nik,
      address: args.address,
      phone: args.phone,
      ktp_image_url: args.ktp_image_url,
    });
  },
});

export const getById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});
