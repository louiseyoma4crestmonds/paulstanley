import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Video, Calendar, Package, Heart, Loader2, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Request {
  id: number;
  userId: number;
  type: string;
  preferredDate?: string;
  preferredDateTime?: string;
  location?: string;
  platform?: string;
  message: string;
  status: string;
  createdAt: string;
  user?: {
    fullName: string;
    email: string;
  };
}

interface UserData {
  id: number;
  fullName: string;
  email: string;
  isAdmin: boolean;
}

export default function Admin() {
  const [, setLocation] = useLocation();

  const { data: user, isLoading: userLoading } = useQuery<UserData>({
    queryKey: ["/api/user"],
  });

  const { data: meetGreetRequests, isLoading: meetGreetLoading } = useQuery<Request[]>({
    queryKey: ["/api/admin/meet-greet-requests"],
  });

  const { data: liveCallRequests, isLoading: liveCallLoading } = useQuery<Request[]>({
    queryKey: ["/api/admin/live-call-requests"],
  });

  const { data: allUsers, isLoading: usersLoading } = useQuery<UserData[]>({
    queryKey: ["/api/admin/users"],
  });

  if (!user && !userLoading) {
    setLocation("/login");
    return null;
  }

  if (user && !user.isAdmin) {
    setLocation("/dashboard");
    return null;
  }

  if (userLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8 flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
              <p className="text-muted-foreground">Manage content and review user requests</p>
            </div>
          </div>

          <Tabs defaultValue="requests" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 gap-2">
              <TabsTrigger value="requests" data-testid="tab-requests">
                <Video className="mr-2 h-4 w-4" />
                Requests
              </TabsTrigger>
              <TabsTrigger value="users" data-testid="tab-users">
                <Users className="mr-2 h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="content" data-testid="tab-content">
                <Package className="mr-2 h-4 w-4" />
                Content
              </TabsTrigger>
            </TabsList>

            <TabsContent value="requests" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Meet & Greet Requests</CardTitle>
                  <CardDescription>Review and manage meet & greet requests from users</CardDescription>
                </CardHeader>
                <CardContent>
                  {meetGreetLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : meetGreetRequests && meetGreetRequests.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Preferred Date</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Requested</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {meetGreetRequests.map((request) => (
                          <TableRow key={request.id} data-testid={`row-meetgreet-${request.id}`}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{request.user?.fullName || 'Unknown'}</div>
                                <div className="text-sm text-muted-foreground">{request.user?.email || 'N/A'}</div>
                              </div>
                            </TableCell>
                            <TableCell>{request.preferredDate ? new Date(request.preferredDate).toLocaleDateString() : 'N/A'}</TableCell>
                            <TableCell>{request.location || 'N/A'}</TableCell>
                            <TableCell className="max-w-xs truncate">{request.message}</TableCell>
                            <TableCell>
                              <Badge variant={request.status === "pending" ? "secondary" : "default"}>
                                {request.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No meet & greet requests yet
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Live Call Requests</CardTitle>
                  <CardDescription>Review and manage live call requests from users</CardDescription>
                </CardHeader>
                <CardContent>
                  {liveCallLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : liveCallRequests && liveCallRequests.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Preferred DateTime</TableHead>
                          <TableHead>Platform</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Requested</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {liveCallRequests.map((request) => (
                          <TableRow key={request.id} data-testid={`row-livecall-${request.id}`}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{request.user?.fullName || 'Unknown'}</div>
                                <div className="text-sm text-muted-foreground">{request.user?.email || 'N/A'}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {request.preferredDateTime 
                                ? new Date(request.preferredDateTime).toLocaleString() 
                                : 'N/A'}
                            </TableCell>
                            <TableCell>{request.platform || 'N/A'}</TableCell>
                            <TableCell className="max-w-xs truncate">{request.message}</TableCell>
                            <TableCell>
                              <Badge variant={request.status === "pending" ? "secondary" : "default"}>
                                {request.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No live call requests yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Registered Users</CardTitle>
                  <CardDescription>View all users registered on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : allUsers && allUsers.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Full Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Admin</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allUsers.map((u) => (
                          <TableRow key={u.id} data-testid={`row-user-${u.id}`}>
                            <TableCell>{u.id}</TableCell>
                            <TableCell className="font-medium">{u.fullName}</TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell>
                              {u.isAdmin ? (
                                <Badge variant="default">Admin</Badge>
                              ) : (
                                <Badge variant="outline">User</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No users registered yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Causes
                    </CardTitle>
                    <CardDescription>Manage charitable causes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" data-testid="button-manage-causes">
                      View & Manage Causes
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Events
                    </CardTitle>
                    <CardDescription>Manage upcoming events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" data-testid="button-manage-events">
                      View & Manage Events
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Products
                    </CardTitle>
                    <CardDescription>Manage merchandise products</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" data-testid="button-manage-products">
                      View & Manage Products
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                  <CardDescription>Overview of platform content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{allUsers?.length || 0}</div>
                      <div className="text-sm text-muted-foreground">Total Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{meetGreetRequests?.length || 0}</div>
                      <div className="text-sm text-muted-foreground">Meet & Greet Requests</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{liveCallRequests?.length || 0}</div>
                      <div className="text-sm text-muted-foreground">Live Call Requests</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        {((meetGreetRequests?.length || 0) + (liveCallRequests?.length || 0))}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Requests</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
