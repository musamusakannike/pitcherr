export interface PaystackInitializeResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}


const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

/**
 * Helper to initialize a payment on Paystack.
 */
export async function initializeTransaction(
  email: string,
  amountNGN: number,
  userId: string,
  originUrl: string
): Promise<PaystackInitializeResponse> {
  if (!PAYSTACK_SECRET_KEY || PAYSTACK_SECRET_KEY === "mock") {
    throw new Error("Paystack secret key is not configured in production");
  }

  const reference = `pitcherr_ref_${Math.random().toString(36).substring(2, 15)}`;
  const koboAmount = amountNGN * 100; // Paystack takes amount in lowest denomination (Kobo for NGN)

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: koboAmount.toString(),
      reference,
      callback_url: `${originUrl}/dashboard`,
      metadata: {
        userId,
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Paystack transaction initialization failed: ${errText}`);
  }

  const resData = await response.json();
  if (!resData.status) {
    throw new Error(resData.message || "Initialization status is false");
  }

  return {
    authorization_url: resData.data.authorization_url,
    access_code: resData.data.access_code,
    reference: resData.data.reference,
  };
}

/**
 * Verifies a transaction status on Paystack.
 */
export async function verifyTransaction(reference: string): Promise<boolean> {
  if (!PAYSTACK_SECRET_KEY || PAYSTACK_SECRET_KEY === "mock") {
    throw new Error("Paystack secret key is not configured in production");
  }

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    if (!response.ok) {
      return false;
    }

    const resData = await response.json();
    return resData.status && resData.data && resData.data.status === "success";
  } catch (error) {
    console.error("Paystack transaction verification failed:", error);
    return false;
  }
}

