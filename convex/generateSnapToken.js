"use node";

import { action } from "./_generated/server";
import midtransClient from "midtrans-client";
import { v } from "convex/values";

export const generateSnapToken = action({
  args: {
    houseId: v.id("houses"),
    userName: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    // Ambil key dari query helper
    const serverKey = await ctx.runQuery("envVar:get", { key: "MIDTRANS_SERVER_KEY" });

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey,
    });

    const parameter = {
      transaction_details: {
        order_id: `TeraPro-${Date.now()}`,
        gross_amount: args.amount,
      },
      customer_details: {
        first_name: args.userName,
      },
    };

    const transaction = await snap.createTransaction(parameter);
    return transaction.token;
  },
});
