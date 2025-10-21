import { Engagement, Recommendation } from "@/models";

interface RecommendationStats {
  effectivenessRate: number;
  usedRecommendations: number;
  totalRecommendations: number;
}

export function getRecommendationStats(
  recommendations: Recommendation[],
  engagements: Engagement[]
): RecommendationStats {
  if (recommendations.length === 0) {
    return {
      effectivenessRate: 0,
      usedRecommendations: 0,
      totalRecommendations: 0,
    };
  }

  const engagementMap = new Map<string, number[]>();
  
  for (const engagement of engagements) {
    const key = `${engagement.userId.toString()}_${engagement.courseId.toString()}`;
    const timestamp = new Date(engagement.timestamp).getTime();
    
    if (!engagementMap.has(key)) {
      engagementMap.set(key, []);
    }
    
    engagementMap.get(key)!.push(timestamp);
  }

  let usedRecommendations = 0;

  for (const recommendation of recommendations) {
    const key = `${recommendation.userId.toString()}_${recommendation.courseId.toString()}`;
    const recommendationTime = new Date(recommendation.createdAt).getTime();
    const engagementTimestamps = engagementMap.get(key);
    
    if (engagementTimestamps) {
      const hasMatchingEngagement = engagementTimestamps.some(
        timestamp => timestamp > recommendationTime
      );
      
      if (hasMatchingEngagement) {
        usedRecommendations++;
      }
    }
  }

  const effectivenessRate = (usedRecommendations / recommendations.length) * 100;

  return {
    effectivenessRate: Math.round(effectivenessRate * 100) / 100,
    usedRecommendations,
    totalRecommendations: recommendations.length,
  };
}
