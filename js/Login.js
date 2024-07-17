async function clk(event) {
  event.preventDefault();
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("All fields are required!!");
    return;
  }
  localStorage.setItem("email", email);

  try {
    const response = await fetch("http://localhost:3002/api/v1/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include", // Include credentials to allow cookies to be sent and received
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(`Error: ${errorData.message}`);
      return;
    }

    const data = await response.json();
    if (data.success) {
      alert(data.message);
      window.location.href = "index2.html";
    } else {
      alert("Login successful!");
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("An error occurred. Please try again.");
  }
}
