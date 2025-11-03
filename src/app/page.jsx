import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  try {
    await connectDB();

    const user = await User.findById(session.user.id)
      .populate('userGroups')
      .lean();

    if (!user) {
      redirect("/login");
    }

    const hasGroups = user.userGroups && user.userGroups.length > 0;

    if (!hasGroups) {
      redirect("/dashboard/onboarding");
    }

    if (user.activeGroup) {
      redirect(`/dashboard/groups/${user.activeGroup}/dashboard`);
    } else {
      const firstGroup = user.userGroups[0];
      redirect(`/dashboard/groups/${firstGroup._id}/dashboard`);
    }
  } catch (error) {
    console.error("Home redirect error:", error);
    redirect("/dashboard/onboarding");
  }

  return null;
}