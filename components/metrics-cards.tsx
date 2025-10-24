import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPercentage } from "@/lib/shared/utils";
import type { EngagementWithDetails, Recommendation } from "@/models";

interface MetricsCardsProps {
  engagements: EngagementWithDetails[];
  recommendations: Recommendation[];
  usedRecommendations: number;
  effectivenessRate: number;
}

export function MetricsCards({
  engagements,
  recommendations,
  usedRecommendations,
  effectivenessRate,
}: MetricsCardsProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Total Engagements</CardTitle>
          <CardDescription>
            The total number of engagements across all users and course types.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-5xl font-bold">{engagements.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>
            The number of recommendations given to users and the ratio of used
            recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>Recommendations Given</div>
              <div className="text-2xl font-bold">
                {recommendations?.length}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>Used Recommendations</div>
              <div className="text-2xl font-bold text-blue-600">
                {usedRecommendations}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>Effectiveness Rate</div>
              <div className="text-2xl font-bold text-green-600">
                {formatPercentage(effectivenessRate)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
