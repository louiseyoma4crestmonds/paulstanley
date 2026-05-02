import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProgressCircle from "@/components/ProgressCircle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, Video, Receipt, CheckCircle2, Lock, Loader2, MailWarning } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface UserProgress {
  hasPromoCode: boolean;
  hasDonation: boolean;
  hasProductPurchase: boolean;
  hasLogisticsFee: boolean;
  progressPercentage: number;
}

interface Transaction {
  id: number;
  type: string;
  itemName: string;
  amount: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

interface UserData {
  id: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  isAdmin: boolean;
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [meetFormData, setMeetFormData] = useState({
    preferredDate: "",
    location: "",
    message: "",
  });
  
  const [callFormData, setCallFormData] = useState({
    preferredDateTime: "",
    platform: "",
    message: "",
  });

  const { data: user, isLoading: userLoading } = useQuery<UserData>({
    queryKey: ["/api/user"],
  });

  const { data: progress, isLoading: progressLoading } = useQuery<UserProgress>({
    queryKey: ["/api/user/progress"],
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/user/transactions"],
  });

  const meetGreetMutation = useMutation({
    mutationFn: async (data: typeof meetFormData) => {
      return apiRequest("/api/meet-greet/request", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Request submitted",
        description: "Your meet & greet request has been submitted successfully!",
      });
      setMeetFormData({ preferredDate: "", location: "", message: "" });
    },
    onError: (error: Error) => {
      toast({
        title: "Request failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const liveCallMutation = useMutation({
    mutationFn: async (data: typeof callFormData) => {
      return apiRequest("/api/live-call/request", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Request submitted",
        description: "Your live call request has been submitted successfully!",
      });
      setCallFormData({ preferredDateTime: "", platform: "", message: "" });
    },
    onError: (error: Error) => {
      toast({
        title: "Request failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleMeetGreetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    meetGreetMutation.mutate(meetFormData);
  };

  const handleLiveCallSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    liveCallMutation.mutate(callFormData);
  };

  useEffect(() => {
    if (!user && !userLoading) {
      setLocation("/login");
    }
  }, [user, userLoading]);

  if (userLoading || progressLoading) {
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

  const requirements = [
    { id: "promo", label: "Promo Code or Fan Card", completed: progress?.hasPromoCode || false },
    { id: "donation", label: "Donate to a Cause", completed: progress?.hasDonation || false },
    { id: "product", label: "Purchase a Product", completed: progress?.hasProductPurchase || false },
    { id: "logistics", label: "Pay Logistics Fee", completed: progress?.hasLogisticsFee || false },
  ];

  const progressPercentage = progress?.progressPercentage || 0;
  const canRequest = progressPercentage === 100;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.fullName}</p>
          </div>

          {!user?.emailVerified && (
            <button
              onClick={() => setLocation("/verify-email")}
              data-testid="banner-email-unverified"
              className="w-full mb-6 flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors text-left"
            >
              <MailWarning className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium text-sm">Your email address is not verified</p>
                <p className="text-xs opacity-80">Click here to verify your email and unlock all features</p>
              </div>
              <span className="ml-auto text-xs font-medium underline underline-offset-2 shrink-0">Verify now →</span>
            </button>
          )}

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 gap-2">
              <TabsTrigger value="overview" data-testid="tab-overview">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="requests" data-testid="tab-requests">
                <Video className="mr-2 h-4 w-4" />
                Requests
              </TabsTrigger>
              <TabsTrigger value="history" data-testid="tab-history">
                <Receipt className="mr-2 h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                  <CardDescription>
                    Complete all 4 requirements to unlock Meet & Greet or Live Call access
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-8">
                  <ProgressCircle progress={progressPercentage} requirements={requirements} />
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {canRequest ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <Lock className="h-5 w-5 text-muted-foreground" />}
                      Meet & Greet Request
                    </CardTitle>
                    <CardDescription>
                      Request an in-person or virtual meet & greet
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {canRequest ? (
                      <Button
                        className="w-full"
                        onClick={() => {
                          const tabTrigger = document.querySelector('[value="requests"]') as HTMLElement;
                          tabTrigger?.click();
                        }}
                        data-testid="button-request-meet-greet"
                      >
                        Request Meet & Greet
                      </Button>
                    ) : (
                      <div>
                        <Button className="w-full" disabled data-testid="button-request-meet-greet">
                          <Lock className="mr-2 h-4 w-4" />
                          Complete Requirements
                        </Button>
                        <p className="text-sm text-muted-foreground mt-2 text-center">
                          {Math.round(progressPercentage)}% Complete
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {canRequest ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <Lock className="h-5 w-5 text-muted-foreground" />}
                      Live Call Request
                    </CardTitle>
                    <CardDescription>
                      Schedule a live video call session
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {canRequest ? (
                      <Button
                        className="w-full"
                        onClick={() => {
                          const tabTrigger = document.querySelector('[value="requests"]') as HTMLElement;
                          tabTrigger?.click();
                        }}
                        data-testid="button-request-live-call"
                      >
                        Request Live Call
                      </Button>
                    ) : (
                      <div>
                        <Button className="w-full" disabled data-testid="button-request-live-call">
                          <Lock className="mr-2 h-4 w-4" />
                          Complete Requirements
                        </Button>
                        <p className="text-sm text-muted-foreground mt-2 text-center">
                          {Math.round(progressPercentage)}% Complete
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="requests" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Meet & Greet Request</CardTitle>
                  <CardDescription>
                    {!canRequest ? "Complete all 4 requirements to unlock this feature" : "Fill out the form to request a meet & greet"}
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleMeetGreetSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="meet-date">Preferred Date</Label>
                      <Input
                        id="meet-date"
                        type="date"
                        disabled={!canRequest}
                        value={meetFormData.preferredDate}
                        onChange={(e) => setMeetFormData({ ...meetFormData, preferredDate: e.target.value })}
                        required
                        data-testid="input-meet-date"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="meet-location">Location / Platform</Label>
                      <Input
                        id="meet-location"
                        placeholder="New York or Virtual (Zoom)"
                        disabled={!canRequest}
                        value={meetFormData.location}
                        onChange={(e) => setMeetFormData({ ...meetFormData, location: e.target.value })}
                        required
                        data-testid="input-meet-location"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="meet-message">Message</Label>
                      <Textarea
                        id="meet-message"
                        placeholder="Tell us about yourself and why you'd love to meet..."
                        disabled={!canRequest}
                        value={meetFormData.message}
                        onChange={(e) => setMeetFormData({ ...meetFormData, message: e.target.value })}
                        required
                        data-testid="textarea-meet-message"
                      />
                    </div>
                    <Button type="submit" disabled={!canRequest || meetGreetMutation.isPending} data-testid="button-submit-meet-request">
                      {meetGreetMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Submit Request
                    </Button>
                  </CardContent>
                </form>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Live Call Request</CardTitle>
                  <CardDescription>
                    {!canRequest ? "Complete all 4 requirements to unlock this feature" : "Schedule your live video call"}
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLiveCallSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="call-date">Preferred Date & Time</Label>
                      <Input
                        id="call-date"
                        type="datetime-local"
                        disabled={!canRequest}
                        value={callFormData.preferredDateTime}
                        onChange={(e) => setCallFormData({ ...callFormData, preferredDateTime: e.target.value })}
                        required
                        data-testid="input-call-datetime"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="call-platform">Platform</Label>
                      <Input
                        id="call-platform"
                        placeholder="Zoom, Google Meet, etc."
                        disabled={!canRequest}
                        value={callFormData.platform}
                        onChange={(e) => setCallFormData({ ...callFormData, platform: e.target.value })}
                        required
                        data-testid="input-call-platform"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="call-message">Message</Label>
                      <Textarea
                        id="call-message"
                        placeholder="What would you like to discuss..."
                        disabled={!canRequest}
                        value={callFormData.message}
                        onChange={(e) => setCallFormData({ ...callFormData, message: e.target.value })}
                        required
                        data-testid="textarea-call-message"
                      />
                    </div>
                    <Button type="submit" disabled={!canRequest || liveCallMutation.isPending} data-testid="button-submit-call-request">
                      {liveCallMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Submit Request
                    </Button>
                  </CardContent>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>View all your purchases and donations</CardDescription>
                </CardHeader>
                <CardContent>
                  {transactionsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : transactions && transactions.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Item</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((tx) => (
                          <TableRow key={tx.id} data-testid={`row-transaction-${tx.id}`}>
                            <TableCell>{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>{tx.itemName}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{tx.type}</Badge>
                            </TableCell>
                            <TableCell className="font-semibold">${tx.amount}</TableCell>
                            <TableCell>
                              <Badge variant={tx.status === "completed" ? "default" : "secondary"}>
                                {tx.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No transactions yet
                    </div>
                  )}
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
