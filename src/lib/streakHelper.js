// src/lib/streakHelper.js

export function calculateStreak(activityMap) {
  if (!activityMap || activityMap.size === 0) return 0;

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  const activityDates = Array.from(activityMap.keys())
    .filter(Boolean)
    .sort()
    .reverse();

  if (activityDates.length === 0) return 0;

  const hasRecentActivity = 
    activityDates.includes(today) || 
    activityDates.includes(yesterday);

  if (!hasRecentActivity) return 0;

  let streak = 0;
  let checkDate = new Date(activityDates[0]);

  for (const dateStr of activityDates) {
    const currentDate = checkDate.toISOString().split("T")[0];
    
    if (dateStr === currentDate) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1); // Volta 1 dia
    } else {
      break;
    }
  }

  return streak;
}

export async function calculateGroupStreak(userId, groupId) {
  const Post = require("@/models/Post").default;

  const posts = await Post.find({ 
    user: userId, 
    group: groupId 
  })
    .select("createdAt")
    .sort({ createdAt: -1 })
    .lean();

  if (posts.length === 0) {
    return { streak: 0, checkIns: 0, lastPostDate: null };
  }

  const uniqueDates = new Set(
    posts.map(p => new Date(p.createdAt).toISOString().split("T")[0])
  );

  const checkIns = uniqueDates.size;
  const lastPostDate = new Date(posts[0].createdAt);

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  const sortedDates = Array.from(uniqueDates).sort().reverse();

  const hasRecentActivity = 
    sortedDates.includes(today) || 
    sortedDates.includes(yesterday);

  if (!hasRecentActivity) {
    return { streak: 0, checkIns, lastPostDate };
  }

  let streak = 0;
  let checkDate = new Date(sortedDates[0]);

  for (const dateStr of sortedDates) {
    const currentDate = checkDate.toISOString().split("T")[0];
    
    if (dateStr === currentDate) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return { streak, checkIns, lastPostDate };
}