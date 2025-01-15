import axios from 'axios';
import * as crypto from 'crypto';

export const WOMPI_SANDBOX_API = 'https://api-sandbox.co.uat.wompi.dev/v1';
export const WOMPI_PUBLIC_KEY = 'pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7';
export const WOMPI_PRIVATE_KEY =
  'prv_stagtest_5i0ZGIGiFcDQifYsXxvsny7Y37tKqFWg';
export const WOMPI_INTEGRITY_KEY =
  'stagtest_integrity_nAIBuqayW70XpUqJS4qf4STYiISd89Fp';

interface createIntegritySignatureParams {
  payment_id: string;
  amount_in_cents: number;
}

interface getPaymentSourceIdParams {
  tokenized_credit_card: string;
  acceptance_token: string;
  acceptance_auth_token: string;
  customer_email: string;
}

interface createTransactionInWompiParams {
  amount_in_cents: number;
  customer_email: string;
  reference: string;
  payment_source_id: number;
  integritySignature: string;
}

export const createIntegritySignature = async ({
  payment_id,
  amount_in_cents,
}: createIntegritySignatureParams) => {
  const stringToHash = `${payment_id}${amount_in_cents}COP${WOMPI_INTEGRITY_KEY}`;
  const hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
  return hash;
};

export const getAcceptanceTokens = async () => {
  try {
    const response = await axios.get(
      `${WOMPI_SANDBOX_API}/merchants/${WOMPI_PUBLIC_KEY}`,
    );
    const returnValue = [
      response.data.data.presigned_acceptance.acceptance_token,
      response.data.data.presigned_personal_data_auth.acceptance_token,
    ];
    return returnValue;
  } catch (error) {
    console.error('Error fetching acceptance tokens:', error);
  }
};

export const getPaymentSourceId = async ({
  tokenized_credit_card,
  acceptance_auth_token,
  acceptance_token,
  customer_email,
}: getPaymentSourceIdParams) => {
  const transactionBody = {
    type: 'CARD',
    token: tokenized_credit_card,
    customer_email: customer_email,
    acceptance_token: acceptance_token,
    accept_personal_auth: acceptance_auth_token,
  };

  const headers = {
    Authorization: `Bearer ${WOMPI_PRIVATE_KEY}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.post(
      `${WOMPI_SANDBOX_API}/payment_sources`,
      transactionBody,
      { headers },
    );
    console.log('Payment source created succesfully:', response.data);
    return response.data.data.id;
  } catch (error) {
    console.error(
      'Error creating transaction:',
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

export const getWompiTransactionId = async ({
  amount_in_cents,
  customer_email,
  reference,
  payment_source_id,
  integritySignature,
}: createTransactionInWompiParams) => {
  const transactionBody = {
    amount_in_cents: amount_in_cents,
    currency: 'COP',
    customer_email: customer_email,
    reference: reference,
    signature: integritySignature,
    payment_method: {
      installments: 1,
    },
    payment_source_id: payment_source_id,
  };

  const headers = {
    Authorization: `Bearer ${WOMPI_PRIVATE_KEY}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.post(
      `${WOMPI_SANDBOX_API}/transactions`,
      transactionBody,
      { headers },
    );
    console.log('Transaction created succesfully:', response.data);
    return response.data.data.id;
  } catch (error) {
    console.error(
      'Error creating transaction:',
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};
