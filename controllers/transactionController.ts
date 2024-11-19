import { Request, Response } from 'express';
import axios from 'axios';
import 'dotenv/config';
import { addtransaction, updatetransaction } from '../services/transactionService';
const xapikey = process.env.x_api_key;
const receiverWalletId = process.env.receiverWalletId;
export const initPayment = async (req: Request, res: Response) => {
  try {
    const {amount} = req.body;
    console.log("in init")
    
    const userId = parseInt(req.headers.userid as string, 10);
    console.log(userId)
    const paymentData = {
        receiverWalletId: receiverWalletId,
        token: "TND",
        amount: amount,
        type: "immediate",
        description: "a transaction 49 TND for a premium subscription",
        acceptedPaymentMethods: [
          "wallet",
          "bank_card",
          "e-DINAR"
        ],
        lifespan: 10,
        checkoutForm: true,
        addPaymentFeesToAmount: true,       
        webhook: "http://13.60.57.108/payments/payment-success",
        silentWebhook: true,
        successUrl: "https://gateway.sandbox.konnect.network/payment-success",
        failUrl: "https://gateway.sandbox.konnect.network/payment-failure",
        theme:"light"
      }

    // Make a POST request to Konnect's init payment API
    const response = await axios.post('https://api.preprod.konnect.network/api/v2/payments/init-payment', paymentData, {
      headers: {
        'Content-Type': 'application/json',
        
        'x-api-key' : xapikey,
      },
    });
   
    if(response.status == 200){
    const transaction = await addtransaction(response.data.paymentRef,"PREMIUM",amount,"TND",userId);
  
    
  return  res.status(200).json({
      success: true,
      message: 'Payment initialized successfully',
      data: response.data,
    });
}
return  res.status(404).json({
    success: false,
    message: 'try again',
 
  });
  } catch (error) {
 
   // console.error('Error initializing payment:', error);
    return  res.status(500).json({
      success: false,
      message: 'try again',
   
    });
  }
};
export const paymentsuccess = async (req: Request, res: Response) => {
    try {
      // Capture payment_ref from the query parameters
      const { payment_ref } = req.query;
  
      if (!payment_ref) {
        return res.status(400).json({
          success: false,
          message: 'Payment reference not found in the request',
        });
      }
      
      const response = await axios.get('https://api.preprod.konnect.network/api/v2/payments/'+payment_ref, {
        headers: {
         
        
        },
      });
   
if(response.data.payment.successfulTransactions > 0){
     const transaction = await updatetransaction(payment_ref);

    return  res.status(200).json({
        success: true,
        message: 'Transaction created successfully',
       data: transaction,
      });
    }
    else {
        return res.status(404).json({
            success: false,
            message: 'try again',
           
          });
    }
    } catch (error) {
      
     return res.status(500).json({
        success: false,
        message: 'Error processing webhook',
       
      });
    }
  };