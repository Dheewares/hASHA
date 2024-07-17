import { config } from "dotenv";
import twilio from "twilio";
config

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendMessage = async (body, to) => {
  twilioClient.messages
    .create({
      body: body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    })
    .then((message) => console.log(message.sid))
    .catch((error) => {
      console.error("Error sending SMS:", error);
      return res.status(500).send("Error sending SMS.");
    });
};

export default sendMessage;
