import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CoursePerformance } from "@/lib/business/course-performance";
import { formatTimeSpent } from "@/lib/shared/utils";

interface CoursePerformanceTablesProps {
  topCourses: CoursePerformance[];
  bottomCourses: CoursePerformance[];
}

export function CoursePerformanceTables({
  topCourses,
  bottomCourses,
}: CoursePerformanceTablesProps) {
  return (
    <>
      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Top Performing Courses</CardTitle>
          <CardDescription>
            The top 3 courses based on engagement count × total time spent
            (popularity + depth).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/2">Course Title</TableHead>
                <TableHead className="w-1/6">Difficulty</TableHead>
                <TableHead className="w-1/6">Total Engagements</TableHead>
                <TableHead className="w-1/6">Total Time Spent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topCourses.map((performance) => (
                <TableRow key={performance.course._id.toString()}>
                  <TableCell className="font-medium">
                    {performance.course.title}
                  </TableCell>
                  <TableCell>{performance.course.difficulty}</TableCell>
                  <TableCell>{performance.totalEngagements}</TableCell>
                  <TableCell>
                    {formatTimeSpent(performance.totalTimeSpent)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Lowest Performing Courses</CardTitle>
          <CardDescription>
            The bottom 3 courses based on engagement count × total time spent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/2">Course Title</TableHead>
                <TableHead className="w-1/6">Difficulty</TableHead>
                <TableHead className="w-1/6">Total Engagements</TableHead>
                <TableHead className="w-1/6">Total Time Spent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bottomCourses.map((performance) => (
                <TableRow key={performance.course._id.toString()}>
                  <TableCell className="font-medium">
                    {performance.course.title}
                  </TableCell>
                  <TableCell>{performance.course.difficulty}</TableCell>
                  <TableCell>{performance.totalEngagements}</TableCell>
                  <TableCell>
                    {formatTimeSpent(performance.totalTimeSpent)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
