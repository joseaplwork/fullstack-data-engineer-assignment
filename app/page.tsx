import { Dashboard } from "@/components/dashboard";
import { Course, EngagementWithDetails, Recommendation } from "@/models";
import { headers } from "next/headers";

export default async function Home() {
  const host = headers().get("Host")!;
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  const { engagements } = await fetch(
    `${baseUrl}/api/engagements`,
    { cache: "no-store" }
  ).then((res) => res.json() as Promise<{ engagements: EngagementWithDetails[] }>);

  const { recommendations } = await fetch(
    `${baseUrl}/api/recommendations`,
    { cache: "no-store" }
  ).then((res) => res.json() as Promise<{ recommendations: Recommendation[] }>);

  const { courses } = await fetch(
    `${baseUrl}/api/courses`,
    { cache: "no-store" }
  ).then((res) => res.json() as Promise<{ courses: Course[] }>);


  return (
    <Dashboard engagements={engagements} recommendations={recommendations} courses={courses} />
  );
}

export const dynamic = "force-dynamic";
