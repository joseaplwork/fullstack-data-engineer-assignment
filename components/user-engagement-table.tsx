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
import { formatTime, formatTimeSpent } from "@/lib/shared/utils";
import type { EngagementWithDetails } from "@/models";

interface UserEngagementTableProps {
  engagements: EngagementWithDetails[];
}

export function UserEngagementTable({ engagements }: UserEngagementTableProps) {
  return (
    <Card className="col-span-1 lg:col-span-2 lg:row-span-2">
      <CardHeader>
        <CardTitle>User Engagement</CardTitle>
        <CardDescription>
          Detailed engagement data for each user and course type.
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[20lh] overflow-y-scroll">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Time Spent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {engagements?.map((engagement: EngagementWithDetails) => (
              <TableRow key={engagement._id.toString()}>
                <TableCell>{engagement.user.name}</TableCell>
                <TableCell>{engagement.course.title}</TableCell>
                <TableCell>{formatTime(engagement.timestamp)}</TableCell>
                <TableCell>{formatTimeSpent(engagement.timeSpent)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
