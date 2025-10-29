"use server";

import { db } from "@/firebase/admin";
import { getCurrentUser } from "./auth.action";

export async function updateUserProfile(data: {
  name?: string;
  email?: string;
  bio?: string;
  location?: string;
  currentRole?: string;
  experience?: string;
  targetRole?: string;
}) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return { success: false, error: "Unauthorized" };
    }

    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.currentRole !== undefined)
      updateData.currentRole = data.currentRole;
    if (data.experience !== undefined) updateData.experience = data.experience;
    if (data.targetRole !== undefined) updateData.targetRole = data.targetRole;

    updateData.updatedAt = new Date().toISOString();

    await db.collection("users").doc(user.id).update(updateData);

    return { success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function getUserProfile() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userDoc = await db.collection("users").doc(user.id).get();
    if (!userDoc.exists) {
      return { success: false, error: "User not found" };
    }

    const userData = userDoc.data();
    return {
      success: true,
      profile: {
        name: userData?.name || "",
        email: userData?.email || "",
        bio: userData?.bio || "",
        location: userData?.location || "",
        currentRole: userData?.currentRole || "",
        experience: userData?.experience || "",
        targetRole: userData?.targetRole || "",
        createdAt: userData?.createdAt || "",
      },
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { success: false, error: "Failed to fetch profile" };
  }
}
