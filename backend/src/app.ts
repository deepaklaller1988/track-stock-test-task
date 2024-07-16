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
    const userAlertsRef:any = await admin.firestore().collection('users').get();
    const userAlerts:any = userAlertsRef.docs.map((doc:any) => doc.data());

    // Subscribe to symbols based on user preferences
    userAlerts.forEach((alert:any) => {
      if (alert.threshold) {
        if (isUSStock(alert.symbol)) {
          // Subscribe to US stock
          socket.send(JSON.stringify({ type: 'subscribe', symbol: alert.symbol }));
        } else if (isForexPair(alert.symbol)) {
          // Subscribe to Forex pair
          socket.send(JSON.stringify({ type: 'subscribe', symbol: `forex:${alert.symbol}` }));
        } else if (isCryptoPair(alert.symbol)) {
          // Subscribe to Crypto pair
          socket.send(JSON.stringify({ type: 'subscribe', symbol: `crypto:${alert.symbol}` }));
        } else {
          console.log(`Unsupported symbol type: ${alert.symbol}`);
        }
      }
    });

    console.log('Subscribed to symbols based on user preferences.');
  } catch (error) {
    console.error('Error subscribing to symbols:', error);
  }
});

socket.addEventListener('message', async function (event:any) {
  try {
    const data = JSON.parse(event.data);

    // Check if message type is trade
    if (data.type === 'trade') {
      const trades = data.data;
      const userAlertsRef:any = await admin.firestore().collection('users').get();
      const userAlerts:any = userAlertsRef.docs.map((doc:any) => doc.data());
      trades.forEach((trade:any) => {
        const symbol = trade.s;
        const price = trade.p;
        const volume = trade.v;

    
        // Process each user alert
        userAlerts.forEach(async (alert:any) => {
          if (alert.symbol === symbol && parseInt(alert.price) >= parseInt(price) && alert.threshold) {
            await sendEmail(alert.email, symbol, price, alert.price);

            // Update user's threshold status in Firestore
            const userRecord = await admin.auth().getUserByEmail(alert.email);
            await admin.firestore().collection('users').doc(userRecord.uid).set({
              threshold: false
            }, { merge: true });

            console.log(`${alert.email}, ${symbol}, ${price}, Email sent successfully.`);
          }
        });
      });
    }
  } catch (error) {
    console.error('Error processing message:', error);
  }
});

// Function to send email notifications
async function sendEmail(email:any, symbol:any, price:any, alertPrice:any) {
  // Implement email sending logic here
  let body = `<div style="text-align: center; background-color: #00466a; color: #ffffff; border-radius: 4px; padding: 10px 20px; margin-top: 20px; display: inline-block;">
                <span style="font-size: 20px; font-weight: bold;">Set Price : ${alertPrice} Current Price : ${price} </span>
            </div>`;

  // Implement your sendEmail function logic here using nodemailer or similar
  // Example using console.log for demonstration
  console.log(`Sending email to ${email} for symbol ${symbol} at price ${price}`);
}

// Function to check if symbol is a US stock
function isUSStock(symbol:any) {
  // Implement logic to check if symbol is a US stock (e.g., exchanges like NYSE, NASDAQ)
  return true; // Replace with actual implementation
}

// Function to check if symbol is a Forex pair
function isForexPair(symbol:any) {
  // Implement logic to check if symbol is a Forex pair (e.g., starts with forex: or supported by Finnhub)
  return symbol.startsWith('EURUSD') || symbol.startsWith('USDJPY'); // Replace with actual implementation
}

// Function to check if symbol is a Crypto pair
function isCryptoPair(symbol:any) {
  // Implement logic to check if symbol is a Crypto pair (e.g., starts with crypto: or supported by Finnhub)
  return symbol.startsWith('BTCUSD') || symbol.startsWith('ETHUSD'); // Replace with actual implementation
}

// Ensure to handle errors, close events, etc., for WebSocket as needed
socket.addEventListener('error', function (event) {
  console.error('WebSocket error:', event.error);
});

socket.addEventListener('close', function (event) {
  console.log('WebSocket closed:', event);
});

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