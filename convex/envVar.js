import { query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {
    key: v.string(), // ✅ pakai objek, bukan array
  },
  handler: async (ctx, args) => {
    return process.env[args.key];
  },
});
