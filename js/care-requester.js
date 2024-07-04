var serviceRequests = []; // Initialize empty array to store service requests

// Function to toggle visibility of the service request form
function toggleForm() {
  var form = document.getElementById("service-request-form");
  form.style.display = form.style.display === "none" ? "block" : "none";
}

// Function to handle form submission
document
  .getElementById("serviceRequestForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Collect form data
    var serviceName = document.getElementById("services").value;
    var description = document.getElementById("description").value;
    var address = document.getElementById("address").value;
    var serviceType = document.getElementById("service-type").value;
    var serviceHours = document.getElementById("service-hours").value;
    var serviceDays = document.getElementById("service-days").value;

    if (serviceName && description) {
      // Create a new service request object
      var newServiceRequest = {
        serviceName: serviceName,
        description: description,
        address: address,
        serviceType: serviceType,
        serviceHours: serviceHours,
        serviceDays: serviceDays,
      };
      // Add the new service request object to the array
      serviceRequests.push(newServiceRequest);
    } else {
      alert("Forms input are mandatory to be filled");
    }

    // Update the displayed list of service requests
    listServiceRequests();

    // Reset the form
    this.reset();

    // Hide the form after submission (optional)
    var form = document.getElementById("service-request-form");
    form.style.display = "none";
  });

// Function to list service requests
function listServiceRequests() {
  var listContainer = document.getElementById("serviceRequestsList");

  // Clear existing list items
  listContainer.innerHTML = "";

  // Loop through the array and create list items

  serviceRequests.forEach(function (service, index) {
    var listItem = document.createElement("li");

    listItem.innerHTML = `<b>Service:</b>${service.serviceName}<br>  <b>Type:</b>${service.serviceType}<br>  <b>Days:</b>${service.serviceDays}<br>  <b>Hours:</b>${service.serviceHours}<br><br>`;

    listContainer.appendChild(listItem);
  });
}

// Initial call to populate the list of service requests
listServiceRequests();
