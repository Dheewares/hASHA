document
  .getElementById("requestPasswordResetForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const loading = document.getElementById("loading");

    loading.style.display = "block"; // Show loading indicator

    try {
      const response = await fetch(
        "http://localhost:3002/api/v1/user/request-password-reset",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();
      loading.style.display = "none"; // Hide loading indicator

      if (response.ok) {
        alert(result.message);
        window.location.href = "login.html";
      } else {
        alert(result.message || "Error sending reset link.");
      }
    } catch (error) {
      console.error("Error sending reset link:", error);
      loading.style.display = "none"; // Hide loading indicator
      alert("An error occurred while sending reset link. Please try again.");
    }
  });
