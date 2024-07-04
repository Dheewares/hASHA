var modal = document.getElementById("head-cont");
var btn = document.getElementById("about-hasha");
var span = document.getElementsByClassName("close")[0];
function show() {
  modal.style.display = "block";
}
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
function signing() {
  location.replace("Signup.html");
}
function alerts() {
  window.alert(
    "Sorry for the inconvenience | This section is under construction"
  );
}
