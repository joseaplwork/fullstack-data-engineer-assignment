import { getCoursePerformance } from "@/lib/business/course-performance";
import { getRecommendationStats } from "@/lib/business/recommendation-stats";
import type { Course, EngagementWithDetails, Recommendation } from "@/models";
import { CoursePerformanceTables } from "./course-performance-tables";
import { MetricsCards } from "./metrics-cards";
import { UserEngagementTable } from "./user-engagement-table";

interface Props {
  courses: Course[];
  engagements: EngagementWithDetails[];
  recommendations: Recommendation[];
}

export function Dashboard({ courses, engagements, recommendations }: Props) {
  const { topCourses, bottomCourses } = getCoursePerformance(
    courses,
    engagements
  );
  const { usedRecommendations, effectivenessRate } = getRecommendationStats(
    recommendations,
    engagements
  );

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-6 p-6">
        <UserEngagementTable engagements={engagements} />
        <MetricsCards
          engagements={engagements}
          recommendations={recommendations}
          usedRecommendations={usedRecommendations}
          effectivenessRate={effectivenessRate}
        />
        <CoursePerformanceTables
          topCourses={topCourses}
          bottomCourses={bottomCourses}
        />
      </main>
    </div>
  );
}
