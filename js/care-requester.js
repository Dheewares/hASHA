var serviceRequests = []; // Initialize empty array to store service requests

// Function to toggle visibility of the service request form
function toggleForm() {
  var form = document.getElementById("service-request-form");
  form.style.display = form.style.display === "none" ? "block" : "none";
}

// Function to handle form submission
document
  .getElementById("serviceRequestForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // Collect form data
    var serviceName = document.getElementById("services").value;
    var description = document.getElementById("description").value;
    var address = document.getElementById("address").value;
    var city = document.getElementById("city").value;
    var state = document.getElementById("state").value;
    var pincode = document.getElementById("pincode").value;
    var serviceType = document.getElementById("service-type").value;
    var serviceHours = document.getElementById("service-hours").value;
    var serviceDays = document.getElementById("service-days").value;
    var startTime = document.getElementById("start-time").value;
    var endTime = document.getElementById("end-time").value;
    var deadline = document.getElementById("deadline").value;
    var email = localStorage.getItem("email"); // Make sure the key is correct

    // Log form data for debugging
    console.log({
      serviceName,
      description,
      address,
      city,
      state,
      pincode,
      serviceType,
      serviceHours,
      serviceDays,
      startTime,
      endTime,
      deadline,
      email,
    });

    var formattedDeadline = new Date(deadline)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    if (
      serviceName &&
      description &&
      address &&
      city &&
      state &&
      pincode &&
      serviceType &&
      serviceHours &&
      serviceDays &&
      startTime &&
      endTime &&
      deadline &&
      email
    ) {
      // Create a new service request object
      var newServiceRequest = {
        serviceName: serviceName,
        description: description,
        address: address,
        city: city,
        state: state,
        pincode: pincode,
        serviceType: serviceType,
        serviceHours: serviceHours,
        serviceDays: serviceDays,
        startTime: startTime,
        endTime: endTime,
        deadline: formattedDeadline,
        email: email,
      };

      try {
        // Send the service request to the API
        const response = await fetch(
          "http://localhost:3002/api/v1/jobs/job-postings",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newServiceRequest),
            credentials: "include", // Include credentials if necessary
          }
        );

        // Log the response status for debugging
        console.log("Response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("Response data:", data);
          alert("Job posting created successfully!");

          // Add the new service request object to the array
          serviceRequests.push(newServiceRequest);

          // Update the displayed list of service requests
          listServiceRequests();

          // Reset the form
          this.reset();

          // Hide the form after submission (optional)
          var form = document.getElementById("service-request-form");
          form.style.display = "none";

          // Reload the page to fetch and display new service requests
          window.location.reload();
        } else {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const errorData = await response.json();
            console.error("Error data:", errorData);
            alert(`Error: ${errorData.message}`);
          } else {
            const errorText = await response.text();
            console.error("Error text:", errorText);
            alert(`Error: ${errorText}`);
          }
        }
      } catch (error) {
        console.log("Error creating job posting:", error);
        alert("An error occurred. Please try again.");
      }
    } else {
      alert("All fields are mandatory to be filled");
    }
  });

// Function to fetch and list existing service requests
async function fetchAndListServiceRequests() {
  const email = localStorage.getItem("email");

  if (!email) {
    console.error("Email is required to fetch previous job postings");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3002/api/v1/jobs/get-previous-job?email=${email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Fetched data:", data);
      serviceRequests = data; // Update serviceRequests with fetched data

      listServiceRequests(); // Update the UI with fetched data
    } else {
      console.error("Failed to fetch service requests:", response.status);
    }
  } catch (error) {
    console.error("Error fetching service requests:", error);
  }
}

function listServiceRequests() {
  var listContainer = document.getElementById("serviceRequestsList");
  listContainer.innerHTML = ""; // Clear existing list items
  serviceRequests.forEach(function (service) {
    var listItem = document.createElement("li");
    listItem.innerHTML = `
      <b>Service:</b> ${service.title || "N/A"}<br>
      <b>Type:</b> ${service.employment_type || "N/A"}<br>
      <b>Days:</b> ${service.service_days || "Not specified"}<br>
      <b>Hours:</b> ${service.service_hours || "Not specified"}<br><br>
    `;
    listContainer.appendChild(listItem);
  });
}

// Initial call to fetch and list service requests
fetchAndListServiceRequests();
