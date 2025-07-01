/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as bookings from "../bookings.js";
import type * as chats from "../chats.js";
import type * as consultants from "../consultants.js";
import type * as generateSnapToken from "../generateSnapToken.js";
import type * as getStorageUrl from "../getStorageUrl.js";
import type * as houseAdsPayments from "../houseAdsPayments.js";
import type * as houses from "../houses.js";
import type * as storage from "../storage.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  bookings: typeof bookings;
  chats: typeof chats;
  consultants: typeof consultants;
  generateSnapToken: typeof generateSnapToken;
  getStorageUrl: typeof getStorageUrl;
  houseAdsPayments: typeof houseAdsPayments;
  houses: typeof houses;
  storage: typeof storage;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
