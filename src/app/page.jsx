// src/app/page.jsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Group from "@/models/Group";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  try {
    await connectDB();
    
    const userGroups = await Group.find({
      'members.user': session.user.id
    }).lean();

    if (userGroups.length === 0) {
      redirect("/dashboard/onboarding");
    }

    const firstGroup = userGroups[0];
    redirect(`/dashboard/groups/${firstGroup._id}/dashboard`);
    
  } catch (error) {
    redirect("/dashboard/onboarding");
  }
}