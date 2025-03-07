import axios from 'axios';
import * as crypto from 'crypto';
import 'dotenv/config';

export const WOMPI_SANDBOX_API = process.env.WOMPI_SANDBOX_API;
export const WOMPI_PUBLIC_KEY = process.env.WOMPI_PUBLIC_KEY;
export const WOMPI_PRIVATE_KEY = process.env.WOMPI_PRIVATE_KEY;
export const WOMPI_INTEGRITY_KEY = process.env.WOMPI_INTEGRITY_KEY;

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
    return response.data.data.id;
  } catch (error) {
    console.error(
      'Error creating transaction:',
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};
