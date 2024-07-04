function alerts() {
  window.alert(
    "Sorry for the inconvenience | This section is under construction"
  );
}

async function handleLogout(event) {
  event.preventDefault();
  try {
    const response = await fetch("http://localhost:3002/api/v1/user/logout", {
      method: "POST",
      credentials: "include",
    });
    if (response.ok) {
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = "Login.html";
    } else {
      console.error("Failed to logout");
    }
  } catch (error) {
    console.error("Error logging out:", error);
  }
}

// Add the event listener once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("logout").addEventListener("click", handleLogout);
});

/**
 * TO DISPLAY USERNAME AFTER LOGIN
 */
