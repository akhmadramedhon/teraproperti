import { action } from "./_generated/server";
import { v } from "convex/values";

export const getStorageUrl = action({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});