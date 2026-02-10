import { useMemo } from "react";
import { useParams } from "react-router";
import { AdvancedImage } from "@cloudinary/react";
import { useShow } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { ClassDetails } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { bannerPhoto } from "@/lib/cloudinary";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DataTable } from "@/components/refine-ui/data-table/data-table";

type ClassUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
};

const Show = () => {
  const { id } = useParams();
  const classId = id ?? "";

  const { query } = useShow<ClassDetails>({ resource: "classes" });

  const classDetails = query.data?.data;
  const { isLoading, isError } = query;

  const studentColumns = useMemo<ColumnDef<ClassUser>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        size: 240,
        header: () => <p className="column-title">Student</p>,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar className="size-7">
              {row.original.image && (
                <AvatarImage src={row.original.image} alt={row.original.name} />
              )}
              <AvatarFallback>{getInitials(row.original.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col truncate">
              <span className="truncate">{row.original.name}</span>
              <span className="text-xs text-muted-foreground truncate">
                {row.original.email}
              </span>
            </div>
          </div>
        ),
      },
      {
        id: "details",
        size: 140,
        header: () => <p className="column-title">Details</p>,
        cell: ({ row }) => (
          <ShowButton
            resource="users"
            recordItemId={row.original.id}
            variant="outline"
            size="sm"
          >
            View
          </ShowButton>
        ),
      },
    ],
    [],
  );

  const studentsTable = useTable<ClassUser>({
    columns: studentColumns,
    refineCoreProps: {
      resource: `classes/${classId}/users`,
      pagination: {
        pageSize: 3,
        mode: "server",
      },
      filters: {
        permanent: [
          {
            field: "role",
            operator: "eq",
            value: "student",
          },
        ],
      },
    },
  });

  if (isLoading || isError || !classDetails)
    return (
      <ShowView className="class-view class-show">
        <ShowViewHeader resource="classes" title="Class Details" />

        <p className="state-message">
          {isLoading
            ? "Loading class details..."
            : isError
            ? "Failed to load class details..."
            : "Class details not not found"}
        </p>
      </ShowView>
    );

  const teacherName = classDetails.teacher?.name ?? "Unknown";

  const teachersInitials = teacherName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join();

  const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(
    teachersInitials || "NA",
  )}`;

  const {
    bannerUrl,
    name,
    description,
    bannerCldPubId,
    capacity,
    status,
    department,
    subject,
    teacher,
  } = classDetails;

  return (
    <ShowView className="class-view class-show">
      <ShowViewHeader resource="classes" title="Class Details" />

      <div className="banner">
        {bannerUrl ? (
          bannerUrl.includes("res.cloudinary.com") && bannerCldPubId ? (
            <AdvancedImage
              cldImg={bannerPhoto(bannerCldPubId ?? "", name)}
              alt="Class Banner"
            />
          ) : (
            <img src={bannerUrl} alt={name} loading="lazy" />
          )
        ) : (
          <div className="placeholder" />
        )}
      </div>

      <Card className="details-card">
        {/* Class Details */}
        <div>
          <div className="details-header">
            <div>
              <h1>{name}</h1>
              <p>{description}</p>
            </div>

            <div>
              <Badge variant="outline">{capacity} spots</Badge>
              <Badge
                variant={status === "active" ? "default" : "secondary"}
                data-status={status}
              >
                {status?.toUpperCase()}
              </Badge>
            </div>
          </div>

          <div className="details-grid">
            <div className="instructor">
              <p>👨‍🏫 Instructor</p>
              <div>
                <img src={teacher?.image ?? placeholderUrl} alt={teacherName} />

                <div>
                  <p>{teacherName}</p>
                  <p>{teacher?.email}</p>
                </div>
              </div>
            </div>

            <div className="department">
              <p>🏛️ Department</p>

              <div>
                <p>{department?.name}</p>
                <p>{department?.description}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Subject Card */}
        <div className="subject">
          <p>📚 Subject</p>

          <div>
            <Badge variant="outline">
              Code: <span>{subject?.code}</span>
            </Badge>
            <p>{subject?.name}</p>
            <p>{subject?.description}</p>
          </div>
        </div>

        <Separator />

        {/* Join Class Section */}
        <div className="join">
          <h2>🎓 Join Class</h2>

          <ol>
            <li>Ask your teacher for the invite code.</li>
            <li>Click on &quot;Join Class&quot; button.</li>
            <li>Paste the code and click &quot;Join&quot;</li>
          </ol>
        </div>

        <Button size="lg" className="w-full">
          Join Class
        </Button>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Enrolled Students</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable table={studentsTable} />
        </CardContent>
      </Card>
    </ShowView>
  );
};

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
  return `${parts[0][0] ?? ""}${
    parts[parts.length - 1][0] ?? ""
  }`?.toUpperCase();
};

export default Show;
