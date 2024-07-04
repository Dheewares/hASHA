async function clk(event) {
  event.preventDefault();
  email = document.getElementById("username").value;
  password = document.getElementById("password").value;
  if (email === "" && password === "") {
    alert("All fields are required!!");
  }

  try {
    const response = await fetch("http://localhost:3002/api/v1/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(`Error: ${errorData.message}`);
      return;
    }
    const data = await response.json();
    alert("Login successful!");
    window.location.href = "index2.html";
  } catch (error) {
    console.error("Error during login:", error);
    alert("An error occurred. Please try again.");
  }
}
