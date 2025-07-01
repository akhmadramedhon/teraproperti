// convex/consultants.js
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ✅ Pengajuan menjadi konsultan
export const submitConsultant = mutation({
  args: {
    user_id: v.id("users"),
    certificate_number: v.string(),
    training_place_name: v.string(),
    bank_account_number: v.string(),
    certificate_pdf_url: v.string(),
    photo_profile_url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("consultants", {
      ...args,
      status: "pending",
      created_at: new Date().toISOString(),
    });
  },
});

// ✅ Ambil semua pengajuan konsultan yang belum disetujui
export const getAllPengajuanConsultant = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("consultants")
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();
  },
});

// ✅ Setujui pengajuan konsultan
export const approveConsultant = mutation({
  args: { consultantId: v.id("consultants") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.consultantId, {
      status: "approved",
    });
  },
});

// ✅ Tolak pengajuan konsultan
export const rejectConsultant = mutation({
  args: { consultantId: v.id("consultants") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.consultantId, {
      status: "rejected",
    });
  },
});
