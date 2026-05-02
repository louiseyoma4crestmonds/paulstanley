import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertCauseSchema, 
  insertEventSchema, 
  insertProductSchema,
  insertTransactionSchema,
  insertMeetGreetRequestSchema,
  insertPromoCodeSchema,
} from "@shared/schema";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "./email";

function requireAuth(req: Request, res: Response, next: Function) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}

function requireAdmin(req: Request, res: Response, next: Function) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/register", async (req, res) => {
    try {
      const { email, password, fullName } = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationCode = crypto.randomInt(100000, 999999).toString();
      
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        fullName,
        emailVerified: false,
        verificationCode,
      });
      
      await sendVerificationEmail(email, fullName, verificationCode);
      
      res.json({ 
        message: "Registration successful. Please check your email for verification code.",
        userId: user.id,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/verify-email", async (req, res) => {
    try {
      const { email, code } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      if (user.emailVerified) {
        return res.status(400).json({ error: "Email already verified" });
      }
      
      if (user.verificationCode !== code) {
        return res.status(400).json({ error: "Invalid verification code" });
      }
      
      await storage.updateUser(user.id, {
        emailVerified: true,
        verificationCode: null,
      });
      
      res.json({ message: "Email verified successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/resend-code", async (req, res) => {
    try {
      const { email } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      if (user.emailVerified) {
        return res.status(400).json({ error: "Email already verified" });
      }
      
      const verificationCode = crypto.randomInt(100000, 999999).toString();
      await storage.updateUser(user.id, { verificationCode });
      
      await sendVerificationEmail(user.email, user.fullName, verificationCode);
      
      res.json({ message: "Verification code resent" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/user/me", requireAuth, async (req, res) => {
    res.json(req.user);
  });

  app.patch("/api/user/me", requireAuth, async (req, res) => {
    try {
      const { fullName, phone, address, city } = req.body;
      const user = await storage.updateUser(req.user!.id, {
        fullName,
        phone,
        address,
        city,
      });
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/user/progress", requireAuth, async (req, res) => {
    try {
      const progress = await storage.getUserProgress(req.user!.id);
      res.json(progress);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/causes", async (req, res) => {
    try {
      const causes = await storage.getCauses();
      res.json(causes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/causes/:id", async (req, res) => {
    try {
      const cause = await storage.getCause(req.params.id);
      if (!cause) {
        return res.status(404).json({ error: "Cause not found" });
      }
      res.json(cause);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/causes", requireAdmin, async (req, res) => {
    try {
      const data = insertCauseSchema.parse(req.body);
      const cause = await storage.createCause(data);
      res.json(cause);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/causes/:id", requireAdmin, async (req, res) => {
    try {
      const cause = await storage.updateCause(req.params.id, req.body);
      if (!cause) {
        return res.status(404).json({ error: "Cause not found" });
      }
      res.json(cause);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/causes/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteCause(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Cause not found" });
      }
      res.json({ message: "Cause deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/events", requireAdmin, async (req, res) => {
    try {
      const data = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(data);
      res.json(event);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/events/:id", requireAdmin, async (req, res) => {
    try {
      const event = await storage.updateEvent(req.params.id, req.body);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/events/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteEvent(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json({ message: "Event deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/products", requireAdmin, async (req, res) => {
    try {
      const data = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(data);
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ message: "Product deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/transactions", requireAuth, async (req, res) => {
    try {
      const transactions = await storage.getTransactionsByUser(req.user!.id);
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/transactions", requireAuth, async (req, res) => {
    try {
      const data = insertTransactionSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });
      const transaction = await storage.createTransaction(data);
      res.json(transaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/meet-greet-requests", requireAuth, async (req, res) => {
    try {
      if (req.user!.isAdmin) {
        const requests = await storage.getAllMeetGreetRequests();
        res.json(requests);
      } else {
        const requests = await storage.getMeetGreetRequestsByUser(req.user!.id);
        res.json(requests);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/meet-greet-requests", requireAuth, async (req, res) => {
    try {
      const progress = await storage.getUserProgress(req.user!.id);
      if (progress.progress < 100) {
        return res.status(403).json({ 
          error: "You must complete all 4 requirements before requesting a meet & greet",
          progress: progress.progress,
        });
      }
      
      const data = insertMeetGreetRequestSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });
      const request = await storage.createMeetGreetRequest(data);
      res.json(request);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/meet-greet-requests/:id", requireAdmin, async (req, res) => {
    try {
      const request = await storage.updateMeetGreetRequest(req.params.id, req.body);
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }
      res.json(request);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/promo-codes/use", requireAuth, async (req, res) => {
    try {
      const { code } = req.body;
      const promoCode = await storage.getPromoCode(code);
      
      if (!promoCode) {
        return res.status(404).json({ error: "Invalid promo code" });
      }
      
      if (promoCode.used) {
        return res.status(400).json({ error: "Promo code already used" });
      }
      
      const usedCode = await storage.usePromoCode(code, req.user!.id);
      if (!usedCode) {
        return res.status(400).json({ error: "Failed to use promo code" });
      }
      
      await storage.createTransaction({
        userId: req.user!.id,
        type: "promo_code",
        itemName: `Promo Code: ${code}`,
        amount: "0",
        status: "completed",
        paymentMethod: "promo_code",
      });
      
      res.json({ message: "Promo code activated successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/promo-codes", requireAdmin, async (req, res) => {
    try {
      const data = insertPromoCodeSchema.parse(req.body);
      const promoCode = await storage.createPromoCode(data);
      res.json(promoCode);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/paypal/create-order", requireAuth, async (req, res) => {
    try {
      const { amount, type, itemId, itemName } = req.body;
      
      if (!amount || !type || !itemName) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const { createPayPalOrder } = await import("./paypal");
      const order = await createPayPalOrder(amount);
      
      res.json({ orderId: order.id });
    } catch (error: any) {
      console.error("Create PayPal order error:", error);
      res.status(500).json({ error: "Failed to create PayPal order" });
    }
  });

  app.post("/api/paypal/capture-order", requireAuth, async (req, res) => {
    try {
      const { orderId, type, itemId, itemName, amount } = req.body;
      
      if (!orderId || !type || !itemName || !amount) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const { capturePayPalOrder } = await import("./paypal");
      const capture = await capturePayPalOrder(orderId);
      
      if (capture.status === "COMPLETED") {
        await storage.createTransaction({
          userId: req.user!.id,
          type,
          itemId,
          itemName,
          amount,
          status: "completed",
          paymentMethod: "paypal",
          paypalOrderId: orderId,
        });

        if (type === "product") {
          const product = await storage.getProduct(itemId!);
          if (product && product.stock > 0) {
            await storage.updateProduct(itemId!, { stock: Number(product.stock) - 1 });
          }
        } else if (type === "donation") {
          const cause = await storage.getCause(itemId!);
          if (cause) {
            const newRaised = (parseFloat(cause.raised) + parseFloat(amount)).toFixed(2);
            await storage.updateCause(itemId!, { raised: newRaised });
          }
        }
        
        res.json({ success: true, transaction: capture });
      } else {
        res.status(400).json({ error: "Payment not completed" });
      }
    } catch (error: any) {
      console.error("Capture PayPal order error:", error);
      res.status(500).json({ error: "Failed to capture PayPal order" });
    }
  });

  app.post("/api/crypto/payment", requireAuth, async (req, res) => {
    try {
      const { type, itemId, itemName, amount, currency, txHash } = req.body;
      
      if (!type || !itemName || !amount || !currency || !txHash) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      await storage.createTransaction({
        userId: req.user!.id,
        type,
        itemId,
        itemName,
        amount,
        status: "pending",
        paymentMethod: `crypto_${currency.toLowerCase()}`,
        cryptoTxHash: txHash,
      });
      
      res.json({ message: "Crypto payment submitted for verification" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/fan-card/purchase", requireAuth, async (req, res) => {
    try {
      const progress = await storage.getUserProgress(req.user!.id);
      if (progress.hasPromoCode) {
        return res.status(400).json({ error: "You already have a promo code or fan card" });
      }

      const { orderId } = req.body;
      
      if (!orderId) {
        return res.status(400).json({ error: "PayPal order ID required" });
      }

      const { capturePayPalOrder } = await import("./paypal");
      const capture = await capturePayPalOrder(orderId);
      
      if (capture.status === "COMPLETED") {
        await storage.createTransaction({
          userId: req.user!.id,
          type: "fan_card",
          itemName: "Fan Card Purchase",
          amount: "50.00",
          status: "completed",
          paymentMethod: "paypal",
          paypalOrderId: orderId,
        });
        
        res.json({ success: true, message: "Fan card purchased successfully" });
      } else {
        res.status(400).json({ error: "Payment not completed" });
      }
    } catch (error: any) {
      console.error("Fan card purchase error:", error);
      res.status(500).json({ error: "Failed to process fan card purchase" });
    }
  });

  app.post("/api/logistics-fee/pay", requireAuth, async (req, res) => {
    try {
      const progress = await storage.getUserProgress(req.user!.id);
      if (progress.hasLogisticsFee) {
        return res.status(400).json({ error: "Logistics fee already paid" });
      }

      const { orderId } = req.body;
      
      if (!orderId) {
        return res.status(400).json({ error: "PayPal order ID required" });
      }

      const { capturePayPalOrder } = await import("./paypal");
      const capture = await capturePayPalOrder(orderId);
      
      if (capture.status === "COMPLETED") {
        await storage.createTransaction({
          userId: req.user!.id,
          type: "logistics_fee",
          itemName: "Logistics Fee Payment",
          amount: "200.00",
          status: "completed",
          paymentMethod: "paypal",
          paypalOrderId: orderId,
        });
        
        res.json({ success: true, message: "Logistics fee paid successfully" });
      } else {
        res.status(400).json({ error: "Payment not completed" });
      }
    } catch (error: any) {
      console.error("Logistics fee payment error:", error);
      res.status(500).json({ error: "Failed to process logistics fee payment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
