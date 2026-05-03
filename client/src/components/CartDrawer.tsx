import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Minus, Plus, Trash2, ShoppingBag, Copy, CheckCircle, Loader2, ExternalLink } from "lucide-react";
import { SiPaypal, SiTether } from "react-icons/si";
import { useCart } from "@/contexts/CartContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Settings {
  paypal_email?: string;
  usdt_wallet?: string;
}

interface UserData {
  id: string;
}

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, clearCart, isOpen, setIsOpen, total, count } = useCart();
  const { toast } = useToast();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paypalTxId, setPaypalTxId] = useState("");
  const [usdtTxHash, setUsdtTxHash] = useState("");
  const [copied, setCopied] = useState(false);

  const { data: user } = useQuery<UserData>({ queryKey: ["/api/user"] });
  const { data: settings } = useQuery<Settings>({ queryKey: ["/api/settings"] });

  const checkoutMutation = useMutation({
    mutationFn: async ({ method, reference }: { method: "paypal" | "usdt"; reference: string }) => {
      for (const item of items) {
        await apiRequest("/api/transactions", {
          method: "POST",
          body: JSON.stringify({
            type: "product",
            itemId: item.productId,
            itemName: item.name,
            amount: (item.price * item.quantity).toFixed(2),
            status: "pending",
            paymentMethod: method === "paypal" ? "paypal_manual" : "crypto_usdt",
            paypalOrderId: method === "paypal" ? reference : undefined,
            cryptoTxHash: method === "usdt" ? reference : undefined,
          }),
        });
      }
    },
    onSuccess: () => {
      clearCart();
      setCheckoutOpen(false);
      setIsOpen(false);
      setPaypalTxId("");
      setUsdtTxHash("");
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/progress"] });
      toast({
        title: "Order submitted!",
        description: "Your payment is being verified. Your progress will update once confirmed.",
      });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message || "Failed to submit order", variant: "destructive" });
    },
  });

  const handlePaypalSubmit = () => {
    if (!user) {
      toast({ title: "Please log in", description: "You must be logged in to checkout", variant: "destructive" });
      return;
    }
    if (!paypalTxId.trim()) {
      toast({ title: "Missing reference", description: "Please enter your PayPal transaction ID", variant: "destructive" });
      return;
    }
    checkoutMutation.mutate({ method: "paypal", reference: paypalTxId.trim() });
  };

  const handleUsdtSubmit = () => {
    if (!user) {
      toast({ title: "Please log in", description: "You must be logged in to checkout", variant: "destructive" });
      return;
    }
    if (!usdtTxHash.trim()) {
      toast({ title: "Missing hash", description: "Please enter your USDT transaction hash", variant: "destructive" });
      return;
    }
    checkoutMutation.mutate({ method: "usdt", reference: usdtTxHash.trim() });
  };

  const copyWallet = () => {
    if (settings?.usdt_wallet) {
      navigator.clipboard.writeText(settings.usdt_wallet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openPayPal = () => {
    if (settings?.paypal_email) {
      const email = settings.paypal_email.trim();
      const url = email.startsWith("http") ? email : `https://paypal.me/${email.replace("@", "")}/${total.toFixed(2)}`;
      window.open(url, "_blank");
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-md flex flex-col">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Your Cart
              {count > 0 && (
                <Badge className="ml-1">{count}</Badge>
              )}
            </SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <ShoppingBag className="h-16 w-16 opacity-20" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Continue Shopping</Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3 items-start" data-testid={`cart-item-${item.productId}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-primary font-semibold">${item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          data-testid={`button-decrease-${item.productId}`}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          data-testid={`button-increase-${item.productId}`}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 ml-auto text-destructive"
                          onClick={() => removeItem(item.productId)}
                          data-testid={`button-remove-${item.productId}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm font-semibold flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setCheckoutOpen(true)}
                  data-testid="button-checkout"
                >
                  Proceed to Checkout
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => setIsOpen(false)}>
                  Continue Shopping
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Checkout — ${total.toFixed(2)}</DialogTitle>
            <DialogDescription>Choose your payment method and complete the payment, then submit the confirmation below.</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="paypal">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="paypal" data-testid="tab-paypal">
                <SiPaypal className="mr-2 h-4 w-4 text-[#0070BA]" />
                PayPal
              </TabsTrigger>
              <TabsTrigger value="usdt" data-testid="tab-usdt">
                <SiTether className="mr-2 h-4 w-4 text-[#26A17B]" />
                USDT
              </TabsTrigger>
            </TabsList>

            <TabsContent value="paypal" className="space-y-4 pt-2">
              {settings?.paypal_email ? (
                <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">Send ${total.toFixed(2)} USD to:</p>
                  <p className="font-mono font-semibold text-lg break-all">{settings.paypal_email}</p>
                  <Button variant="outline" size="sm" onClick={openPayPal} className="w-full" data-testid="button-open-paypal">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open PayPal to Pay
                  </Button>
                </div>
              ) : (
                <div className="rounded-lg border bg-muted/50 p-4 text-center text-muted-foreground text-sm">
                  PayPal payment not configured yet. Please contact support.
                </div>
              )}
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="paypal-tx">PayPal Transaction ID</Label>
                <Input
                  id="paypal-tx"
                  placeholder="e.g. 5TY05013RG879831D"
                  value={paypalTxId}
                  onChange={(e) => setPaypalTxId(e.target.value)}
                  data-testid="input-paypal-txid"
                />
                <p className="text-xs text-muted-foreground">After paying, enter your PayPal transaction ID for verification.</p>
              </div>
              <Button
                className="w-full"
                onClick={handlePaypalSubmit}
                disabled={checkoutMutation.isPending || !paypalTxId.trim()}
                data-testid="button-submit-paypal"
              >
                {checkoutMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SiPaypal className="mr-2 h-4 w-4" />}
                Submit PayPal Payment
              </Button>
            </TabsContent>

            <TabsContent value="usdt" className="space-y-4 pt-2">
              {settings?.usdt_wallet ? (
                <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">Send ${total.toFixed(2)} USDT (TRC20) to:</p>
                  <p className="font-mono text-sm break-all leading-relaxed">{settings.usdt_wallet}</p>
                  <Button variant="outline" size="sm" onClick={copyWallet} className="w-full" data-testid="button-copy-wallet">
                    {copied ? (
                      <><CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Copied!</>
                    ) : (
                      <><Copy className="mr-2 h-4 w-4" /> Copy Wallet Address</>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="rounded-lg border bg-muted/50 p-4 text-center text-muted-foreground text-sm">
                  USDT wallet not configured yet. Please contact support.
                </div>
              )}
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="usdt-hash">Transaction Hash (TxHash)</Label>
                <Input
                  id="usdt-hash"
                  placeholder="e.g. 0x4f8a9b2c..."
                  value={usdtTxHash}
                  onChange={(e) => setUsdtTxHash(e.target.value)}
                  data-testid="input-usdt-txhash"
                />
                <p className="text-xs text-muted-foreground">After sending USDT, paste the transaction hash from your wallet.</p>
              </div>
              <Button
                className="w-full"
                onClick={handleUsdtSubmit}
                disabled={checkoutMutation.isPending || !usdtTxHash.trim()}
                data-testid="button-submit-usdt"
              >
                {checkoutMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SiTether className="mr-2 h-4 w-4" />}
                Submit USDT Payment
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
