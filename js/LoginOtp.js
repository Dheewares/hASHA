async function validateOTP(event) {
  event.preventDefault();
  const enteredOTP = document.getElementById("otp").value;
  const email = sessionStorage.getItem("email");

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
      window.open("index2.html", "_self");
    } else {
      alert(result.message || "Invalid OTP! Please try again.");
    }
  } catch (error) {
    console.error("Error validating OTP:", error);
    alert("An error occurred while validating the OTP. Please try again.");
  }
}
