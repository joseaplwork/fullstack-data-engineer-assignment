import { Dashboard } from "@/components/dashboard";
import {
  queryCourses,
  queryEngagementsWithDetails,
  queryRecommendations,
} from "@/lib/queries";
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
  } catch (error) {
    console.error("Failed to load dashboard data:", error);

    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Failed to Load Dashboard
          </h1>
          <p className="text-gray-600 mb-4">
            There was an error loading the dashboard data. Please check the
            server logs for more details.
          </p>
          <div className="bg-gray-100 p-4 rounded text-sm text-left">
            <strong>Error:</strong>{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </div>
        </div>
      </div>
    );
  }
}
