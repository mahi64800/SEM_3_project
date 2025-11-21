import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
  try {
    const { userId } = await req.auth();

    console.log("AUTH MIDDLEWARE RUNNING FOR USER:", userId);

    const user = await clerkClient.users.getUser(userId);

    console.log("PRIVATE METADATA:", user.privateMetadata);
    console.log("PLAN FOUND IN PRIVATE METADATA:", user.privateMetadata?.plan);
    console.log("FREE USAGE FOUND:", user.privateMetadata?.free_usage);

    // Set plan and free usage
    req.plan = user.privateMetadata?.plan || "free";
    req.free_usage = user.privateMetadata?.free_usage || 0;

    console.log("req.plan =", req.plan);
    console.log("req.free_usage =", req.free_usage);

    next();
  } catch (error) {
    console.log("AUTH ERROR:", error.message);
    res.json({ success: false, message: error.message });
  }
};
