import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Users,
  Video,
  Calendar,
  Package,
  Heart,
  Loader2,
  Shield,
  CheckCircle2,
  XCircle,
  Plus,
  Pencil,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface UserProgress {
  hasPromoCode: boolean;
  hasDonation: boolean;
  hasPurchase: boolean;
  hasLogisticsFee: boolean;
  progress: number;
}

interface Request {
  id: string;
  userId: string;
  type: string;
  preferredDate?: string;
  preferredDateTime?: string;
  location?: string;
  platform?: string;
  message: string;
  status: string;
  createdAt: string;
  user?: { fullName: string; email: string };
}

interface UserData {
  id: string;
  fullName: string;
  email: string;
  isAdmin: boolean;
  progress?: UserProgress;
}

interface Cause {
  id: string;
  title: string;
  description: string;
  goal: string;
  raised: string;
  image: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: string;
  image: string;
  stock: number;
}

function ProgressToggle({ userId, flag, value }: { userId: string; flag: string; value: boolean }) {
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (newValue: boolean) =>
      apiRequest(`/api/admin/users/${userId}/progress`, {
        method: "PATCH",
        body: JSON.stringify({ flag, value: newValue }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] }),
    onError: (err: any) =>
      toast({ title: "Error", description: err.message || "Failed to update", variant: "destructive" }),
  });
  return (
    <Switch
      checked={value}
      onCheckedChange={(checked) => mutation.mutate(checked)}
      disabled={mutation.isPending}
      data-testid={`switch-${flag}-${userId}`}
    />
  );
}

function CausesManager() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Cause | null>(null);
  const [form, setForm] = useState({ title: "", description: "", goal: "", image: "" });

  const { data: causes, isLoading } = useQuery<Cause[]>({ queryKey: ["/api/causes"] });

  const saveMutation = useMutation({
    mutationFn: (data: typeof form) =>
      editing
        ? apiRequest(`/api/causes/${editing.id}`, { method: "PATCH", body: JSON.stringify(data) })
        : apiRequest("/api/causes", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/causes"] });
      setDialogOpen(false);
      toast({ title: editing ? "Cause updated" : "Cause created" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/causes/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/causes"] });
      toast({ title: "Cause deleted" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const openAdd = () => {
    setEditing(null);
    setForm({ title: "", description: "", goal: "", image: "" });
    setDialogOpen(true);
  };

  const openEdit = (c: Cause) => {
    setEditing(c);
    setForm({ title: c.title, description: c.description, goal: c.goal, image: c.image });
    setDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2"><Heart className="h-5 w-5" /> Causes</CardTitle>
          <CardDescription>Manage charitable causes shown to fans</CardDescription>
        </div>
        <Button size="sm" onClick={openAdd} data-testid="button-add-cause">
          <Plus className="h-4 w-4 mr-1" /> Add Cause
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : causes && causes.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Goal</TableHead>
                <TableHead>Raised</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {causes.map((c) => {
                const pct = Math.min(100, Math.round((parseFloat(c.raised) / parseFloat(c.goal)) * 100));
                return (
                  <TableRow key={c.id} data-testid={`row-cause-${c.id}`}>
                    <TableCell className="font-medium">{c.title}</TableCell>
                    <TableCell>${parseFloat(c.goal).toLocaleString()}</TableCell>
                    <TableCell>${parseFloat(c.raised).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{pct}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="ghost" onClick={() => openEdit(c)} data-testid={`button-edit-cause-${c.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(c.id)} disabled={deleteMutation.isPending} data-testid={`button-delete-cause-${c.id}`}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">No causes yet. Add one to get started.</div>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Cause" : "Add Cause"}</DialogTitle>
            <DialogDescription>Fill in the details for this charitable cause.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="input-cause-title" />
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} data-testid="input-cause-description" />
            </div>
            <div className="space-y-1">
              <Label>Goal ($)</Label>
              <Input type="number" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} data-testid="input-cause-goal" />
            </div>
            <div className="space-y-1">
              <Label>Image URL</Label>
              <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} data-testid="input-cause-image" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending} data-testid="button-save-cause">
              {saveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editing ? "Save Changes" : "Create Cause"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function EventsManager() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState({ title: "", date: "", location: "", image: "" });

  const { data: events, isLoading } = useQuery<Event[]>({ queryKey: ["/api/events"] });

  const saveMutation = useMutation({
    mutationFn: (data: typeof form) => {
      const body = { ...data, date: new Date(data.date).toISOString() };
      return editing
        ? apiRequest(`/api/events/${editing.id}`, { method: "PATCH", body: JSON.stringify(body) })
        : apiRequest("/api/events", { method: "POST", body: JSON.stringify(body) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      setDialogOpen(false);
      toast({ title: editing ? "Event updated" : "Event created" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/events/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({ title: "Event deleted" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const openAdd = () => {
    setEditing(null);
    setForm({ title: "", date: "", location: "", image: "" });
    setDialogOpen(true);
  };

  const openEdit = (e: Event) => {
    setEditing(e);
    setForm({ title: e.title, date: new Date(e.date).toISOString().slice(0, 16), location: e.location, image: e.image });
    setDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" /> Events</CardTitle>
          <CardDescription>Manage upcoming events and appearances</CardDescription>
        </div>
        <Button size="sm" onClick={openAdd} data-testid="button-add-event">
          <Plus className="h-4 w-4 mr-1" /> Add Event
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : events && events.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((e) => (
                <TableRow key={e.id} data-testid={`row-event-${e.id}`}>
                  <TableCell className="font-medium">{e.title}</TableCell>
                  <TableCell>{new Date(e.date).toLocaleDateString()}</TableCell>
                  <TableCell>{e.location}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(e)} data-testid={`button-edit-event-${e.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(e.id)} disabled={deleteMutation.isPending} data-testid={`button-delete-event-${e.id}`}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">No events yet. Add one to get started.</div>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Event" : "Add Event"}</DialogTitle>
            <DialogDescription>Fill in the details for this event.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="input-event-title" />
            </div>
            <div className="space-y-1">
              <Label>Date & Time</Label>
              <Input type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} data-testid="input-event-date" />
            </div>
            <div className="space-y-1">
              <Label>Location</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} data-testid="input-event-location" />
            </div>
            <div className="space-y-1">
              <Label>Image URL</Label>
              <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} data-testid="input-event-image" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending} data-testid="button-save-event">
              {saveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editing ? "Save Changes" : "Create Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function ProductsManager() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", image: "", stock: "0" });

  const { data: products, isLoading } = useQuery<Product[]>({ queryKey: ["/api/products"] });

  const saveMutation = useMutation({
    mutationFn: (data: typeof form) => {
      const body = { ...data, stock: parseInt(data.stock) };
      return editing
        ? apiRequest(`/api/products/${editing.id}`, { method: "PATCH", body: JSON.stringify(body) })
        : apiRequest("/api/products", { method: "POST", body: JSON.stringify(body) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setDialogOpen(false);
      toast({ title: editing ? "Product updated" : "Product created" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/products/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product deleted" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", description: "", price: "", image: "", stock: "0" });
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description || "", price: p.price, image: p.image, stock: String(p.stock) });
    setDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" /> Products</CardTitle>
          <CardDescription>Manage merchandise available in the shop</CardDescription>
        </div>
        <Button size="sm" onClick={openAdd} data-testid="button-add-product">
          <Plus className="h-4 w-4 mr-1" /> Add Product
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : products && products.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id} data-testid={`row-product-${p.id}`}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>${parseFloat(p.price).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={p.stock > 0 ? "outline" : "destructive"}>
                      {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(p)} data-testid={`button-edit-product-${p.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(p.id)} disabled={deleteMutation.isPending} data-testid={`button-delete-product-${p.id}`}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">No products yet. Add one to get started.</div>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Product" : "Add Product"}</DialogTitle>
            <DialogDescription>Fill in the details for this merchandise item.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="input-product-name" />
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} data-testid="input-product-description" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Price ($)</Label>
                <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} data-testid="input-product-price" />
              </div>
              <div className="space-y-1">
                <Label>Stock</Label>
                <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} data-testid="input-product-stock" />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Image URL</Label>
              <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} data-testid="input-product-image" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending} data-testid="button-save-product">
              {saveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editing ? "Save Changes" : "Create Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default function Admin() {
  const [, setLocation] = useLocation();

  const { data: user, isLoading: userLoading } = useQuery<UserData>({ queryKey: ["/api/user"] });
  const { data: meetGreetRequests, isLoading: meetGreetLoading } = useQuery<Request[]>({ queryKey: ["/api/admin/meet-greet-requests"] });
  const { data: liveCallRequests, isLoading: liveCallLoading } = useQuery<Request[]>({ queryKey: ["/api/admin/live-call-requests"] });
  const { data: allUsers, isLoading: usersLoading } = useQuery<UserData[]>({ queryKey: ["/api/admin/users"] });
  const { data: causes } = useQuery<Cause[]>({ queryKey: ["/api/causes"] });
  const { data: events } = useQuery<Event[]>({ queryKey: ["/api/events"] });
  const { data: products } = useQuery<Product[]>({ queryKey: ["/api/products"] });

  useEffect(() => {
    if (!userLoading && !user) setLocation("/login");
    else if (!userLoading && user && !user.isAdmin) setLocation("/dashboard");
  }, [user, userLoading, setLocation]);

  if (userLoading || !user || !user.isAdmin) {
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

  const fanUsers = allUsers?.filter((u) => !u.isAdmin) ?? [];
  const unlockedFans = fanUsers.filter((u) => u.progress?.progress === 100).length;

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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="requests" data-testid="tab-requests">
                <Video className="mr-2 h-4 w-4" /> Requests
              </TabsTrigger>
              <TabsTrigger value="users" data-testid="tab-users">
                <Users className="mr-2 h-4 w-4" /> Users
              </TabsTrigger>
              <TabsTrigger value="content" data-testid="tab-content">
                <Package className="mr-2 h-4 w-4" /> Content
              </TabsTrigger>
            </TabsList>

            {/* ── REQUESTS TAB ── */}
            <TabsContent value="requests" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Meet & Greet Requests</CardTitle>
                  <CardDescription>All fan requests for an in-person meet & greet</CardDescription>
                </CardHeader>
                <CardContent>
                  {meetGreetLoading ? (
                    <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                  ) : meetGreetRequests && meetGreetRequests.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fan</TableHead>
                          <TableHead>Preferred Date</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Submitted</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {meetGreetRequests.map((r) => (
                          <TableRow key={r.id} data-testid={`row-meetgreet-${r.id}`}>
                            <TableCell>
                              <div className="font-medium">{r.user?.fullName || "Unknown"}</div>
                              <div className="text-xs text-muted-foreground">{r.user?.email || "N/A"}</div>
                            </TableCell>
                            <TableCell>{r.preferredDate ? new Date(r.preferredDate).toLocaleDateString() : "N/A"}</TableCell>
                            <TableCell>{r.location || "N/A"}</TableCell>
                            <TableCell className="max-w-xs">
                              <p className="truncate">{r.message}</p>
                            </TableCell>
                            <TableCell>
                              <Badge variant={r.status === "pending" ? "secondary" : "default"}>{r.status}</Badge>
                            </TableCell>
                            <TableCell>{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">No meet & greet requests yet.</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Live Call Requests</CardTitle>
                  <CardDescription>All fan requests for a personal video call</CardDescription>
                </CardHeader>
                <CardContent>
                  {liveCallLoading ? (
                    <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                  ) : liveCallRequests && liveCallRequests.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fan</TableHead>
                          <TableHead>Preferred Date/Time</TableHead>
                          <TableHead>Platform</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Submitted</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {liveCallRequests.map((r) => (
                          <TableRow key={r.id} data-testid={`row-livecall-${r.id}`}>
                            <TableCell>
                              <div className="font-medium">{r.user?.fullName || "Unknown"}</div>
                              <div className="text-xs text-muted-foreground">{r.user?.email || "N/A"}</div>
                            </TableCell>
                            <TableCell>{r.preferredDate ? new Date(r.preferredDate).toLocaleString() : "N/A"}</TableCell>
                            <TableCell>{r.platform || "N/A"}</TableCell>
                            <TableCell className="max-w-xs">
                              <p className="truncate">{r.message}</p>
                            </TableCell>
                            <TableCell>
                              <Badge variant={r.status === "pending" ? "secondary" : "default"}>{r.status}</Badge>
                            </TableCell>
                            <TableCell>{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">No live call requests yet.</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── USERS TAB ── */}
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Registered Fans & Progress</CardTitle>
                  <CardDescription>
                    View all fans and manually manage their 4 requirement flags. Toggle a switch to grant or revoke a requirement.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                  ) : allUsers && allUsers.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-center">Progress</TableHead>
                            <TableHead className="text-center">Promo / Fan Card</TableHead>
                            <TableHead className="text-center">Donation</TableHead>
                            <TableHead className="text-center">Merchandise</TableHead>
                            <TableHead className="text-center">Logistics Fee</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {allUsers.map((u) => {
                            const p = u.progress;
                            const done = p
                              ? [p.hasPromoCode, p.hasDonation, p.hasPurchase, p.hasLogisticsFee].filter(Boolean).length
                              : 0;
                            return (
                              <TableRow key={u.id} data-testid={`row-user-${u.id}`}>
                                <TableCell>
                                  <div className="font-medium">{u.fullName}</div>
                                  <div className="text-xs text-muted-foreground">{u.email}</div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={u.isAdmin ? "default" : "outline"}>{u.isAdmin ? "Admin" : "Fan"}</Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                  {u.isAdmin ? (
                                    <span className="text-xs text-muted-foreground">—</span>
                                  ) : (
                                    <div className="flex flex-col items-center gap-1">
                                      <span className="text-sm font-semibold">{done}/4</span>
                                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(done / 4) * 100}%` }} />
                                      </div>
                                      {done === 4 && <span className="text-xs text-green-600 font-medium">Unlocked</span>}
                                    </div>
                                  )}
                                </TableCell>
                                {u.isAdmin ? (
                                  <TableCell colSpan={4} className="text-center text-xs text-muted-foreground">Admin accounts skip requirements</TableCell>
                                ) : (
                                  <>
                                    {[
                                      { flag: "hasPromoCode", val: p?.hasPromoCode },
                                      { flag: "hasDonation", val: p?.hasDonation },
                                      { flag: "hasPurchase", val: p?.hasPurchase },
                                      { flag: "hasLogisticsFee", val: p?.hasLogisticsFee },
                                    ].map(({ flag, val }) => (
                                      <TableCell key={flag} className="text-center">
                                        <div className="flex items-center justify-center gap-1.5">
                                          {val ? (
                                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                          ) : (
                                            <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                                          )}
                                          <ProgressToggle userId={u.id} flag={flag} value={val ?? false} />
                                        </div>
                                      </TableCell>
                                    ))}
                                  </>
                                )}
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">No users registered yet.</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── CONTENT TAB ── */}
            <TabsContent value="content" className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" /> Quick Stats
                  </CardTitle>
                  <CardDescription>Live overview of platform activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { label: "Total Fans", value: fanUsers.length, testId: "stat-total-users" },
                      { label: "Fans Unlocked", value: unlockedFans, testId: "stat-unlocked-fans" },
                      { label: "Meet & Greet Requests", value: meetGreetRequests?.length ?? 0, testId: "stat-meetgreet-requests" },
                      { label: "Live Call Requests", value: liveCallRequests?.length ?? 0, testId: "stat-livecall-requests" },
                      { label: "Causes", value: causes?.length ?? 0, testId: "stat-causes" },
                      { label: "Events", value: events?.length ?? 0, testId: "stat-events" },
                      { label: "Products", value: products?.length ?? 0, testId: "stat-products" },
                      { label: "Total Requests", value: (meetGreetRequests?.length ?? 0) + (liveCallRequests?.length ?? 0), testId: "stat-total-requests" },
                    ].map(({ label, value, testId }) => (
                      <div key={testId} className="text-center p-3 rounded-lg bg-muted/50">
                        <div className="text-3xl font-bold text-primary" data-testid={testId}>{value}</div>
                        <div className="text-sm text-muted-foreground mt-1">{label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <CausesManager />
              <EventsManager />
              <ProductsManager />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
