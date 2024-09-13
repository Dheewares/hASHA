document.addEventListener("DOMContentLoaded", (event) => {
  // Open the modal
  const modal = document.getElementById("head-cont");
  const btn = document.getElementById("about-hasha");
  const span = document.getElementsByClassName("close")[0];
  btn.onclick = function () {
    modal.style.display = "block";
  };
  span.onclick = function () {
    modal.style.display = "none";
    
  };
  // Close the modal when clicking outside of the modal content
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
     
    }
  };
});

function signing() {
  location.replace("Signup.html");
}
function alerts() {
  window.alert(
    "Sorry for the inconvenience | This section is under construction"
  );
}
