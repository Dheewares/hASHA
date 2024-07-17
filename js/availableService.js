var jobs = [];

// Function to display job listings
function displayJobListings(jobs) {
  var jobListingsContainer = document.getElementById("jobListings");

  // Clear existing job items
  jobListingsContainer.innerHTML = "";

  // Loop through the array and create job items
  jobs.forEach(function (job) {
    var jobItem = document.createElement("div");
    jobItem.className = "job-item";

    jobItem.innerHTML = `
      <b>Job Title:</b> ${job.title}<br>
      <b>Location:</b> ${job.location}<br>
      <b>Street Address:</b> ${job.street_address}<br>
      <b>City:</b> ${job.city}<br>
      <b>State:</b> ${job.state}<br>
      <b>Pincode:</b> ${job.pincode}<br>
      <b>Employment Type:</b> ${job.employment_type}<br>
      <button class="apply-button" onclick="applyForJob(${job.job_id})">Apply</button>
    `;

    jobListingsContainer.appendChild(jobItem);
  });
}

// Function to filter jobs based on search input
function filterJobs() {
  var searchTerm = document.getElementById("searchBar").value.toLowerCase();
  var filteredJobs = jobs.filter(function (job) {
    return job.title.toLowerCase().includes(searchTerm);
  });
  displayJobListings(filteredJobs);
}

function applyForJob(jobId) {
  var email = localStorage.getItem("email");

  if (!email) {
    alert("Please log in to apply for jobs.");
    window.location.href = "Login.html"; // Redirect to login page
    return;
  }

  // Fetch job details and submit application
  fetch(`http://localhost:3002/api/v1/jobs/appliedFor`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      job_id: jobId,
      email: email,
      status: "Applied", // Initial status when applying
      // You may need to fetch role_id and other details as per your application logic
    }),
  })
    .then((response) => {
      if (response.ok) {
        alert(`Successfully applied for job ID: ${jobId}`);
        // Optionally, you can update UI to reflect application status
      } else {
        alert("Failed to apply for the job. Please try again later.");
      }
    })
    .catch((error) => {
      console.error("Error applying for job:", error);
      alert("Failed to apply for the job. Please try again later.");
    });
}

var email = localStorage.getItem("email");
// Fetch job listings from /listJob endpoint
fetch(`http://localhost:3002/api/v1/jobs/list-all-jobs?email=${email}`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => {
    jobs = data.jobs; // Store jobs globally
    displayJobListings(jobs);
  })
  .catch((error) => {
    console.error("Error fetching job listings:", error);
  });
