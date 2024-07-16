// app.ts
import WebSocket from 'ws';
import express from "express";
import authRouter from "./router/authRouter";
import thresholdRouter from "./router/thresholdRouter";
import cors from "cors";
import { admin } from "./config/adminConfig";
import { doc, updateDoc } from "firebase/firestore";
import dotenv from "dotenv";
dotenv.config();

import { sendEmail } from './util/send-mail';

const app = express();
const port = 5000;
app.use(express.json({ limit: "2450mb" }));
app.use(express.urlencoded({ extended: false }));

var corsOptions = {
  origin: function (origin: any, callback: any) {
    callback(null, true);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use("/auth", authRouter);
app.use("/threshold", thresholdRouter);

const socket = new WebSocket('wss://ws.finnhub.io?token=cqadgn9r01qkfes31ut0cqadgn9r01qkfes31utg');

socket.addEventListener('open', async function () {
  try {
    // Fetch all user alerts from Firestore once
    const userAlertsRef = await admin.firestore().collection('users').get();
    const userAlerts = userAlertsRef.docs.map(doc => doc.data());

    // Subscribe to symbols based on user preferences
    userAlerts.forEach(alert => {
      if(alert.threshold){
        socket.send(JSON.stringify({ type: 'subscribe', symbol: alert.symbol }));
      }
    });

    console.log('Subscribed to symbols based on user preferences.');
  } catch (error) {
    console.error('Error subscribing to symbols:', error);
  }
});

socket.addEventListener('message', async function (event:any) {
  try {
    const data = JSON.parse(event?.data);
    const symbol = data?.data?.[0]?.s;
    const price = data?.data?.[0]?.p;

    // Fetch all user alerts from Firestore once
    const userAlertsRef = await admin.firestore().collection('users').get();
    const userAlerts = userAlertsRef.docs.map(doc => doc.data());

    // Process each user alert
    for (const alert of userAlerts) {
      console.log(symbol, price, alert.price, alert.threshold);

      if (alert.symbol === symbol && parseInt(alert.price) >= parseInt(price) && alert.threshold) {
        
        await sendMail(alert.email, symbol, price, alert.price);
        // Update user's threshold status in Firestore
        const userRecord = await admin.auth().getUserByEmail(alert.email);
        await admin.firestore().collection('users').doc(userRecord.uid).set({
          threshold: false
        }, { merge: true });

        // Send email notification
      }
    }
  } catch (error) {
    console.error('Error processing message:', error);
  }
});

// Function to send email notifications
async function sendMail(email:any, symbol:any, price:any, alertPrice:any) {
  // Implement email sending logic here
  let body = `<div style="text-align: center; background-color: #00466a; color: #ffffff; border-radius: 4px; padding: 10px 20px; margin-top: 20px; display: inline-block;">
                <span style="font-size: 20px; font-weight: bold;">Set Price : ${alertPrice} Current Price : ${price} </span>
            </div>`;
  
  // Implement your sendEmail function logic here using nodemailer or similar
  sendEmail(body, email, "Alert!", process.env.VERIFICATION_SENDER_EMAIL_ADDRESS);
  console.log(`${email}, ${symbol}, ${price}, Email sent successfully.`);
}

// import cron from 'node-cron';

// // Define your API endpoint and token
// const apiUrl = 'https://finnhub.io/api/v1/quote';
// const apiKey = 'cqadgn9r01qkfes31ut0cqadgn9r01qkfes31utg';

// cron.schedule('* * * * *', () => {
//   console.log('Running a task every 5 minutes');
//   pollAndProcessAlerts()
// });

// // Function to fetch data from API and process alerts
// async function pollAndProcessAlerts() {
//   try {
//     // Fetch all user alerts from Firestore once
//     const userAlertsRef = await admin.firestore().collection('users').get();
//     const userAlerts = userAlertsRef.docs.map(doc => doc.data());

//     // Iterate through user alerts
//     for (const alert of userAlerts) {
//       if (alert.threshold) {
//         // Fetch latest price for the alert symbol from API
//         const response = await fetch(`${apiUrl}?symbol=${alert.symbol}&token=${apiKey}`);
//         const data = await response.json();
//         const symbol = alert.symbol;
//         const price = data.c; // Assuming 'c' is the property for current price, adjust based on API response
        
//         // Compare price with alert threshold
//         if (parseInt(alert.price) >= parseInt(price)) {
//           // Process alert (send email, update Firestore, etc.)
//           await sendMail(alert.email, symbol, price, alert.price);

//           // Update user's threshold status in Firestore
//           const userRecord = await admin.auth().getUserByEmail(alert.email);
//           await admin.firestore().collection('users').doc(userRecord.uid).set({
//             threshold: false
//           }, { merge: true });

//           console.log(`Alert triggered for ${alert.email}, Symbol: ${symbol}, Price: ${price}`);
//         }
//       }
//     }
//   } catch (error) {
//     console.error('Error polling and processing alerts:', error);
//   }
// }

// Function to send email notifications (similar implementation as before)
// async function sendMail(email:any, symbol:any, price:any, alertPrice:any) {
//   let body = `<div style="text-align: center; background-color: #00466a; color: #ffffff; border-radius: 4px; padding: 10px 20px; margin-top: 20px; display: inline-block;">
//                 <span style="font-size: 20px; font-weight: bold;">Set Price : ${alertPrice} Current Price : ${price} </span>
//             </div>`;

//   // Implement your sendEmail function logic here using nodemailer or similar
//   sendEmail(body, email, "Alert!", process.env.SENDER_EMAIL_ADDRESS);
//   // console.log(`${email}, ${symbol}, ${price}, Email sent successfully.`);
// }

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});