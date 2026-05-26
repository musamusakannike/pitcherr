export interface PaystackInitializeResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface PaystackDVAResponse {
  bankName: string;
  accountNumber: string;
  accountName: string;
  customerCode: string;
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

/**
 * Creates a dedicated virtual account (DVA) for a customer.
 */
export async function createDedicatedVirtualAccount(
  email: string,
  firstName: string,
  lastName: string,
  phone: string
): Promise<PaystackDVAResponse> {
  if (!PAYSTACK_SECRET_KEY || PAYSTACK_SECRET_KEY === "mock") {
    throw new Error("Paystack secret key is not configured in production");
  }

  try {
    // 1. Create/Retrieve customer on Paystack
    const customerResponse = await fetch("https://api.paystack.co/customer", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
      }),
    });

    if (!customerResponse.ok) {
      const errText = await customerResponse.text();
      throw new Error(`Paystack customer creation failed: ${errText}`);
    }

    const customerData = await customerResponse.json();
    const customerCode = customerData.data.customer_code;

    // 2. Create the DVA (Dedicated Virtual Account)
    const dvaResponse = await fetch("https://api.paystack.co/dedicated_account", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: customerCode,
        preferred_bank: "titan-paystack",
      }),
    });

    if (!dvaResponse.ok) {
      const errText = await dvaResponse.text();
      throw new Error(`Paystack dedicated account creation failed: ${errText}`);
    }

    const dvaData = await dvaResponse.json();
    if (!dvaData.status) {
      throw new Error(dvaData.message || "Dedicated account creation failed");
    }

    return {
      bankName: dvaData.data.bank.name,
      accountNumber: dvaData.data.account_number,
      accountName: dvaData.data.account_name,
      customerCode,
    };
  } catch (error: any) {
    console.error("Paystack dedicated account setup error:", error.message);
    throw error;
  }
}
