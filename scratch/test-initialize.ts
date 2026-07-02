import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  const userEmail = "sharersgymtest@gmail.com";
  const totalAmount = 1000;
  const items = [{ name: "Test Item", quantity: 1, price: 1000 }];
  const hasMembership = false;
  const creditAmount = 0;
  const name = "Test User";

  try {
    console.log("Starting test...");
    const secretKey = "sk_TNajNQdHITsyUEZPs8KLwK076Ct5ou";
    const origin = "http://localhost:3000";
    const amountInCents = Math.round(totalAmount * 100).toString();
    const description = "SHARERS GYM: Test Item (x1)";
    const orderId = crypto.randomUUID();

    const kingsPayPayload = {
      amount: "200",
      currency: 'ESPEES',
      description,
      environment: 'production',
      merchant_callback_url: `${origin}/api/checkout/callback?merchantOrderId=${orderId}`,
      merchant_webhook_url: `${origin}/api/webhooks/kingspay`,
      payment_type: 'espees',
      email: userEmail,
      metadata: {
        userEmail: userEmail,
        phone: '',
        name: name,
        totalAmount,
        items,
        hasMembership: !!hasMembership,
        creditAmount: creditAmount,
        clerkId: null
      }
    };

    console.log("Calling KingsPay API...");
    const response = await fetch('https://api.kingspay-gs.com/api/payment/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(kingsPayPayload)
    });

    console.log("Response OK status:", response.ok, response.status);
    if (!response.ok) {
      const text = await response.text();
      console.error("Error from KingsPay:", text);
      return;
    }

    const resData = await response.json();
    console.log("KingsPay response data:", resData);

    const paymentId = resData.id || resData.payment_id || resData.data?.id || resData.data?.payment_id;
    if (!paymentId) {
      console.error("No payment ID in response!");
      return;
    }

    console.log("Writing to Database with order ID:", orderId, "kingspayId:", paymentId);
    const order = await prisma.order.create({
      data: {
        id: orderId,
        kingspayId: paymentId,
        userEmail: userEmail,
        totalAmount,
        items: items as any,
        status: 'PENDING'
      }
    });

    console.log("Order created successfully:", order);
  } catch (error) {
    console.error("Caught exception:", error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
