import { Dashboard } from "@/components/dashboard";
import { ErrorView } from "@/components/error-view";
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
      <ErrorView
        message="Failed to Load Dashboard"
        description="There was an error loading the dashboard data."
      />
    );
  }
}
