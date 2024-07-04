function showOtherDocType() {
  const docType = document.getElementById("identification_doc_type").value;
  const otherDocTypeGroup = document.getElementById("otherDocTypeGroup");

  if (docType === "others") {
    otherDocTypeGroup.style.display = "block";
  } else {
    otherDocTypeGroup.style.display = "none";
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const first_name = document.getElementById("first_name").value;
  const last_name = document.getElementById("last_name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const phone = document.getElementById("phone").value;
  const user_type = document.getElementById("user_type").value;
  const identification_doc_type = document.getElementById(
    "identification_doc_type"
  ).value;
  const otherDocType =
    identification_doc_type === "others"
      ? document.getElementById("otherDocType").value
      : null;

  if (
    !first_name ||
    !last_name ||
    !email ||
    !password ||
    !phone ||
    !user_type ||
    !identification_doc_type
  ) {
    alert("All fields are mandatory");
    return;
  }

  if (identification_doc_type === "others" && !otherDocType) {
    alert("Please specify the other document type");
    return;
  }

  const data = {
    first_name: first_name,
    last_name: last_name,
    email: email,
    password: password,
    phone: phone,
    user_type: user_type,
    identification_doc_type:
      identification_doc_type === "others"
        ? otherDocType
        : identification_doc_type,
  };

  try {
    console.log("Sending request to backend with data:", data);
    const response = await fetch("http://localhost:3002/api/v1/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("Response status:", response.status);
    const result = await response.json();

    if (response.ok) {
      alert("Signup successful!");
      sessionStorage.setItem("email", email);
      window.location.href = "LoginOtp.html";
    } else {
      console.error("Error from server:", result);
      alert(result.message || "Signup failed. Please try again.");
    }
  } catch (error) {
    console.error("Error during signup:", error);
    alert("An error occurred during signup. Please try again.");
  }
}
