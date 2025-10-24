import { Dashboard } from "@/components/dashboard";
import {
  queryCourses,
  queryEngagementsWithDetails,
  queryRecommendations,
} from "@/lib/data/queries";
import type { Course, EngagementWithDetails, Recommendation } from "@/models";

export default async function Home() {
  try {
    const [engagements, recommendations, courses] = await Promise.all([
      queryEngagementsWithDetails(),
      queryRecommendations(),
      queryCourses(),
    ]);

    return (
      <Dashboard
        engagements={engagements as EngagementWithDetails[]}
        recommendations={recommendations as Recommendation[]}
        courses={courses as Course[]}
      />
    );
  } catch (_) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Failed to Load Dashboard
          </h1>
        </div>
      </div>
    );
  }
}
