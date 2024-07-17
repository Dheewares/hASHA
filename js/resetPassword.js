document
  .getElementById("resetPasswordForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const newPassword = document.getElementById("newPassword").value;

    try {
      const response = await fetch(
        "http://localhost:3002/api/v1/user/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, newPassword }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        window.location.href = "login.html";
      } else {
        alert(result.message || "Error resetting password.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("An error occurred while resetting password. Please try again.");
    }
  });
