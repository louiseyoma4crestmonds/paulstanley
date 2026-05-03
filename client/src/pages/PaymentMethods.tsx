import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiPaypal, SiTether } from "react-icons/si";
import { Copy, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface Settings {
  paypal_email?: string;
  usdt_wallet?: string;
}

export default function PaymentMethods() {
  const [copied, setCopied] = useState(false);
  const { data: settings } = useQuery<Settings>({ queryKey: ["/api/settings"] });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Payment Methods</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We accept PayPal and USDT (TRC20) for all purchases. Choose the option that works best for you.
            </p>
          </div>

          <div className="space-y-6">
            {/* PayPal */}
            <Card data-testid="card-paypal">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#0070BA]/10 flex items-center justify-center">
                    <SiPaypal className="h-6 w-6 text-[#0070BA]" />
                  </div>
                  <div>
                    <CardTitle>PayPal</CardTitle>
                    <CardDescription>Secure and instant payments</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Pay securely using your PayPal account or any linked debit/credit card.
                  After completing your payment, submit your PayPal transaction ID in the checkout to confirm your order.
                </p>
                {settings?.paypal_email && (
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Send payment to</p>
                    <p className="font-mono font-semibold">{settings.paypal_email}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* USDT */}
            <Card data-testid="card-usdt">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#26A17B]/10 flex items-center justify-center">
                    <SiTether className="h-6 w-6 text-[#26A17B]" />
                  </div>
                  <div>
                    <CardTitle>USDT (TRC20)</CardTitle>
                    <CardDescription>Tether stablecoin on the TRON network</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Send USDT via the TRC20 (TRON) network to our wallet address below.
                  After sending, paste your transaction hash in the checkout to confirm your order.
                </p>
                {settings?.usdt_wallet ? (
                  <div className="bg-muted rounded-lg p-4 space-y-3">
                    <p className="text-xs text-muted-foreground font-medium">USDT Wallet Address (TRC20)</p>
                    <p className="text-sm font-mono break-all">{settings.usdt_wallet}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(settings.usdt_wallet!)}
                      data-testid="button-copy-usdt"
                    >
                      {copied ? (
                        <><CheckCircle className="mr-2 h-3 w-3 text-green-500" /> Copied!</>
                      ) : (
                        <><Copy className="mr-2 h-3 w-3" /> Copy Address</>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground">
                    Wallet address not configured yet. Please contact support.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Info */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-base">Important Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                {[
                  "Always send USDT on the TRC20 (TRON) network only — sending on other networks may result in lost funds.",
                  "After completing payment, submit your transaction ID or hash in the checkout for verification.",
                  "Your order progress will be updated once your payment has been confirmed by our team.",
                  "For any payment issues, please contact our support team via the Contact page.",
                ].map((text) => (
                  <div key={text} className="flex gap-2">
                    <span className="text-primary font-semibold flex-shrink-0">•</span>
                    <p>{text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
