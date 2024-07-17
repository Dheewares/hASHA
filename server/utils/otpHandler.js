import axios from "axios";

const MSG91_API_KEY = process.env.MSG91_API_KEY;
const SENDER_ID = process.env.SENDER_ID;
const OTP_TEMPLATE_ID = process.env.OTP_TEMPLATE_ID;

export const sendOtp = async (phone, otp) => {
  const url = `https://api.msg91.com/api/v5/otp?authkey=${MSG91_API_KEY}&template_id=${OTP_TEMPLATE_ID}&mobile=${phone}&otp=${otp}&sender=${SENDER_ID}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP");
  }
};
