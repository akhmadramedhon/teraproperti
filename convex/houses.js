// convex/houses.js
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// 1️⃣ Pengajuan rumah baru oleh user
export const submitHouse = mutation({
  args: {
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
    title: v.string(),
    price: v.number(),
    facilities: v.array(v.string()),
    certificate_pdf_url: v.string(),
    house_image_url: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("houses", {
      ...args,
      title: args.title,
      price: args.price,
      facilities: args.facilities,
      status: "pending",
      payment_status: "unpaid",
      created_at: new Date().toISOString()
    });
  }
});

export const getAllPengajuan = query({
  args: {},
  handler: async (ctx) => {
    // Ambil semua rumah dulu
    const houses = await ctx.db.query("houses").collect();

    // Filter di memory: yang sudah bayar saja
    const paidHouses = houses.filter(house => house.payment_status === "unpaid");

    // Ambil semua users
    const users = await ctx.db.query("users").collect();
    const usersMap = Object.fromEntries(users.map((u) => [u._id, u]));

    return paidHouses.map((house) => ({
      _id: house._id,
      status: house.status,
      nib: house.nib,
      ownerName: usersMap[house.user_id]?.name || "Unknown",
    }));
  },
});



export const approvePengajuan = mutation({
  args: { houseId: v.id("houses") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.houseId, {
      status: "approved",
    });
  },
});

export const tolakPengajuan = mutation({
  args: { houseId: v.id("houses") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.houseId, {
      status: "rejected",
    });
  },
});

export const getDetailById = query({
  args: { houseId: v.id("houses") },
  handler: async (ctx, { houseId }) => {
    const house = await ctx.db.get(houseId);
    const user = await ctx.db.get(house.user_id);
    return {
      ...house,
      _id: house._id,
      ownerName: user?.name || "Unknown",
    };
  },
});

export const getApprovedHouses = query({
  handler: async (ctx) => {
    return await ctx.db.query("houses")
      .filter((q) =>
        q.and(
          q.eq(q.field("status"), "approved"),
          q.eq(q.field("payment_status"), "unpaid")
        )
      )
      .order("desc")
      .collect();
  }
});

export const getHouseById = query({
  args: { id: v.id("houses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});