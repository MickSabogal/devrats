// src/lib/streakHelper.js

export function hasPostedToday(lastPostDate) {
  if (!lastPostDate) return false;
  
  const today = new Date().toISOString().split("T")[0];
  const lastPost = new Date(lastPostDate).toISOString().split("T")[0];
  
  return today === lastPost;
}

export function hasPostedTodayInGroup(groupStreak) {
  if (!groupStreak || !groupStreak.lastPostDate) return false;
  
  const today = new Date().toISOString().split("T")[0];
  const lastPost = new Date(groupStreak.lastPostDate).toISOString().split("T")[0];
  
  return today === lastPost;
}

export function calculatePersonalStreak(activityMap) {
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
      checkDate.setDate(checkDate.getDate() - 1);
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
    return { 
      streak: 0, 
      totalPosts: 0, 
      lastPostDate: null 
    };
  }

  const uniqueDates = new Set(
    posts.map(p => new Date(p.createdAt).toISOString().split("T")[0])
  );

  const streak = uniqueDates.size;
  const totalPosts = posts.length;
  const lastPostDate = new Date(posts[0].createdAt);

  return { 
    streak, 
    totalPosts, 
    lastPostDate 
  };
}