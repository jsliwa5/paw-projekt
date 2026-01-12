import { useQuery } from "@tanstack/react-query";
import { Users as UsersIcon, Loader2, Mail } from "lucide-react";
import { type User } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function UsersPage() {
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-4 px-6 py-4 border-b">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground">
            Team members available for task assignment
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <UsersIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No users found</h3>
            <p className="text-sm text-muted-foreground">
              Users will appear here when they register
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            data-testid="users-grid"
          >
            {users.map((user) => (
              <Card
                key={user.id}
                className="hover-elevate transition-shadow duration-200"
                data-testid={`user-card-${user.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p
                        className="font-medium truncate"
                        data-testid={`text-user-name-${user.id}`}
                      >
                        {user.name}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 truncate">
                        <Mail className="h-3 w-3 shrink-0" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
