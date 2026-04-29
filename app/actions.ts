"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function createPostAction(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  
  if (!title || !content) return { error: "Title and content are required" };

  const { error } = await supabase
    .from("posts")
    .insert([{ title, content, author: "익명" }]);

  if (error) {
    console.error("Failed to create post:", error);
    return { error: error.message };
  }

  revalidatePath("/posts");
  return { success: true };
}

export async function deletePostAction(id: number) {
  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete post:", error);
    return { error: error.message };
  }

  revalidatePath("/posts");
  return { success: true };
}
