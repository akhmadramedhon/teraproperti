import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    nik: v.optional(v.string()),
    date_of_birth: v.optional(v.string()), // Simpan format YYYY-MM-DD
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    province: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.union(v.literal("user"), v.literal("consultant"), v.literal("admin")),
    is_verified: v.optional(v.boolean()),
    ktp_image_url: v.optional(v.string()),
    created_at: v.optional(v.string()),
  }).index("by_userId", ["userId"]),

  houses: defineTable({
    user_id: v.id("users"),
    certificate_type: v.string(),
    nib: v.string(),
    village_number: v.string(),
    owner_birth_date: v.string(),
    origin_rights: v.string(),
    issuance_basis: v.string(),
    land_area: v.string(),
    room_info: v.string(),
    rt: v.string(),
    rw: v.string(),
    village: v.string(),
    district: v.string(),
    city: v.string(),
    province: v.string(),
    certificate_pdf_url: v.string(),
    house_image_url: v.string(),
    payment_status: v.optional(v.string()),
    snap_token: v.optional(v.string()),  
    status: v.string(),
    title: v.optional(v.string()),
    price: v.optional(v.number()),
    facilities: v.optional(v.array(v.string())),
    created_at: v.optional(v.string())
  }),

  consultants: defineTable({
    user_id: v.id("users"),
    certificate_number: v.string(),
    training_place_name: v.string(),
    bank_account_number: v.string(),
    certificate_pdf_url: v.string(),
    photo_profile_url: v.optional(v.string()),
    status: v.string(),
    created_at: v.optional(v.string())
  }),

  bookings: defineTable({
    buyer_id: v.id("users"),
    house_id: v.id("houses"),
    consultant_id: v.id("consultants"),
    status: v.optional(v.string()), // pending, paid, completed
    payment_url: v.optional(v.string()),
    feedback: v.optional(v.string()),
    rating: v.optional(v.number()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string())
  }),

  chats: defineTable({
    sender_id: v.id("users"),
    receiver_id: v.id("users"),
    message: v.string(),
    sent_at: v.optional(v.string())
  }).index("by_sender", ["sender_id"])
  .index("by_receiver", ["receiver_id"]),

  house_ads_payments: defineTable({
    house_id: v.id("houses"),
    user_id: v.id("users"),
    payment_url: v.optional(v.string()),
    status: v.optional(v.string()), // pending, paid
    created_at: v.optional(v.string())
  }),
});
