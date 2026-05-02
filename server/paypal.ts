import { Client, OrdersController } from "@paypal/paypal-server-sdk";

const {
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
} = process.env;

if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
  console.warn("PayPal credentials not configured. Payment features will be limited.");
}

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: PAYPAL_CLIENT_ID || "",
    oAuthClientSecret: PAYPAL_CLIENT_SECRET || "",
  },
  environment: "sandbox",
  logging: {
    logLevel: "info",
    logRequest: { logBody: true },
    logResponse: { logHeaders: true },
  },
});

const ordersController = new OrdersController(client);

export async function createPayPalOrder(amount: string, currency: string = "USD") {
  try {
    const order = await ordersController.ordersCreate({
      body: {
        intent: "CAPTURE",
        purchaseUnits: [
          {
            amount: {
              currencyCode: currency,
              value: amount,
            },
          },
        ],
      },
    });
    return order.result;
  } catch (error) {
    console.error("PayPal create order error:", error);
    throw error;
  }
}

export async function capturePayPalOrder(orderId: string) {
  try {
    const capture = await ordersController.ordersCapture({
      id: orderId,
    });
    return capture.result;
  } catch (error) {
    console.error("PayPal capture order error:", error);
    throw error;
  }
}
