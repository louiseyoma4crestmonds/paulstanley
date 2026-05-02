import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<"register" | "verify">("register");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [verificationCode, setVerificationCode] = useState("");

  const registerMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (data.password !== data.confirmPassword) {
        throw new Error("Passwords do not match");
      }
      return apiRequest("/api/register", {
        method: "POST",
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          password: data.password,
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Verification code sent",
        description: "Please check your email for the verification code.",
      });
      setStep("verify");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (code: string) => {
      return apiRequest("/api/verify-email", {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          code,
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Email verified",
        description: "Your account has been created successfully!",
      });
      setLocation("/login");
    },
    onError: (error: Error) => {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    verifyMutation.mutate(verificationCode);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4 bg-muted/30">
        <Card className="w-full max-w-md">
          {step === "register" ? (
            <>
              <CardHeader>
                <CardTitle className="text-2xl">Create Account</CardTitle>
                <CardDescription>Join CelebConnect and start your journey</CardDescription>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      data-testid="input-fullname"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      data-testid="input-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      data-testid="input-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                      data-testid="input-confirm-password"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full" disabled={registerMutation.isPending} data-testid="button-register-submit">
                    {registerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>
                  <p className="text-sm text-center text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline">
                      Sign in
                    </Link>
                  </p>
                </CardFooter>
              </form>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle className="text-2xl">Verify Your Email</CardTitle>
                <CardDescription>
                  We've sent a 6-digit code to {formData.email}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleVerify}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Verification Code</Label>
                    <Input
                      id="code"
                      type="text"
                      placeholder="000000"
                      maxLength={6}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      required
                      data-testid="input-verification-code"
                      className="text-center text-2xl tracking-widest"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full" disabled={verifyMutation.isPending} data-testid="button-verify-submit">
                    {verifyMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Verify Email
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => registerMutation.mutate(formData)}
                    data-testid="button-resend-code"
                  >
                    Resend Code
                  </Button>
                </CardFooter>
              </form>
            </>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  );
}
