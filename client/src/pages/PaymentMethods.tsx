import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SiPaypal, SiBitcoin, SiEthereum, SiLitecoin } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Copy, QrCode } from "lucide-react";

export default function PaymentMethods() {
  const cryptoWallets = [
    {
      name: "Bitcoin",
      symbol: "BTC",
      icon: SiBitcoin,
      address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      color: "text-orange-500",
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      icon: SiEthereum,
      address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4",
      color: "text-blue-500",
    },
    {
      name: "Litecoin",
      symbol: "LTC",
      icon: SiLitecoin,
      address: "LaMT348PWRnrqeeWArpwQPbuanpXDZGEUz",
      color: "text-gray-400",
    },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    console.log("Copied to clipboard:", text);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Payment Methods</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We accept multiple payment methods for your convenience. Choose the option that works best for you.
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-[#0070BA]/10 flex items-center justify-center">
                    <SiPaypal className="h-6 w-6 text-[#0070BA]" />
                  </div>
                  <div>
                    <CardTitle>PayPal</CardTitle>
                    <CardDescription>Secure and instant payments</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Use your PayPal account or credit/debit card for quick and secure transactions. 
                  PayPal integration is available throughout the checkout process.
                </p>
                <Button variant="outline" data-testid="button-paypal-info">
                  <SiPaypal className="mr-2 h-4 w-4" />
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-2xl font-semibold mb-6">Cryptocurrency Payments</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cryptoWallets.map((wallet) => (
                  <Card key={wallet.symbol} data-testid={`card-crypto-${wallet.symbol.toLowerCase()}`}>
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center`}>
                          <wallet.icon className={`h-7 w-7 ${wallet.color}`} />
                        </div>
                        <div>
                          <CardTitle>{wallet.name}</CardTitle>
                          <CardDescription>{wallet.symbol}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-muted rounded-lg p-4 space-y-2">
                        <p className="text-xs text-muted-foreground font-medium">Wallet Address</p>
                        <p className="text-xs font-mono break-all">{wallet.address}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => copyToClipboard(wallet.address)}
                          data-testid={`button-copy-${wallet.symbol.toLowerCase()}`}
                        >
                          <Copy className="mr-2 h-3 w-3" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          data-testid={`button-qr-${wallet.symbol.toLowerCase()}`}
                        >
                          <QrCode className="mr-2 h-3 w-3" />
                          QR Code
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle>Important Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <span className="text-primary font-semibold">•</span>
                  <p className="text-sm text-muted-foreground">
                    All cryptocurrency transactions are processed on the blockchain and may take time to confirm
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="text-primary font-semibold">•</span>
                  <p className="text-sm text-muted-foreground">
                    Please ensure you're sending to the correct wallet address for your chosen cryptocurrency
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="text-primary font-semibold">•</span>
                  <p className="text-sm text-muted-foreground">
                    You'll receive a confirmation email once your payment has been successfully processed
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="text-primary font-semibold">•</span>
                  <p className="text-sm text-muted-foreground">
                    For any payment issues, please contact our support team at support@celebconnect.com
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
