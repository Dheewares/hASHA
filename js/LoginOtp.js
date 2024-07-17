async function validateOTP(event) {
  event.preventDefault();
  const enteredOTP = document.getElementById("otp").value;
  const email = sessionStorage.getItem("email");

  if (!email) {
    alert("Email is not available. Please log in again.");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:3002/api/v1/user/verify-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: enteredOTP }),
      }
    );

    const result = await response.json();

    if (response.ok) {
      alert("OTP validated successfully!");
      window.location.href = "index2.html";
    } else {
      alert(result.message || "Invalid OTP! Please try again.");
    }
  } catch (error) {
    console.error("Error validating OTP:", error);
    alert("An error occurred while validating the OTP. Please try again.");
  }
}

document.getElementById("resend-link").addEventListener("click", async () => {
  const email = sessionStorage.getItem("email");

  if (!email) {
    alert("Email is not available. Please log in again.");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:3002/api/v1/user/resend-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const result = await response.json();

    if (response.ok) {
      alert("OTP has been resent to your email and phone.");
    } else {
      alert(result.message || "Failed to resend OTP. Please try again.");
    }
  } catch (error) {
    console.error("Error resending OTP:", error);
    alert("An error occurred while resending the OTP. Please try again.");
  }
});
