// src/app/page.jsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  console.log("🔍 Session check:", session ? "Authenticated" : "Not authenticated");

  if (session) {
    console.log("✅ Redirecting to dashboard/home");
    redirect("/dashboard/home");
  } else {
    console.log("❌ Redirecting to login");
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-gray-600 border-t-red-600 rounded-full animate-spin" />
    </div>
  );
}
