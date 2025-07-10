const client = ZAFClient.init();
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzecRizo1W7MqfIbHdbNXoGAiEVrNjmWSh6I3DYs9TB7l9PIYWHnUxOI0BUUro7R0rqcA/exec";

// Dropdowns
const teamDropdown = document.getElementById("team");
const errorTypeDropdown = document.getElementById("error_type");
const nameDropdown = document.getElementById("error_done_by");

// Error Types
const roErrorTypes = [
  "Manual error", "Did not follow BI", "Wrong Alts sent", "Wrong refund",
  "Wrong macro", "Wrong tickets", "Double booking", "Incomplete FF",
  "No SOP", "Improper action", "RO TAT", "Wrong DSS", "Others"
];

const ceErrorTypes = [
  "Wrong Information shared",
  "Failed to raise the guest issue with the necessary team.",
  "Did not action callback/follow up/e-mail as per the requirement.",
  "Did not add follow up tag", "No response/inactivity", "other issues",
  "Delayed response to the CX", "Lack of product/service knowledge",
  "Did not follow closing protocol/ force closed", "Did not follow SOP correctly",
  "Did not use DSS/ used incorrect DSS", "Requested incorrect ETA",
  "Lack of explanation", "Raised a CE ping instead of self action"
];

// RO Names
const roNames = [
  "Aacim Zia", "Aayushi Kanjilal", "Abhay Singh", "Rohan Thakur", "Steve Varghese",
  "Surabhi Detani", "Ankita Singh", "Sarthak Gedam", "Sarthak Mishra", "Saroj Sapkota",
  "Himanshu Dwivedi", "Poushali Choudhury", "Mudit Somani", "Sujan A B", "Rishabh Saraf",
  "Mohamed Rizwan", "Ashish Kumar", "Sonal Jaiswal", "Charan Shetti", "Stefy Yohannan",
  "Suvashis Kundu", "Vaishali Bisht", "Nandita Ambwani", "Abhay Singh", "Pranjali Dhongde",
  "Kriti Singh", "Akshita Saikia", "Arun Pratap Singh", "Chetan Bhaskar", "Firdous Tabassum",
  "Govind D", "Jyoti Jaiswal", "Sai Vamsi", "Mousumi Maity", "Akshay Chandrahas",
  "Devyani Parihar", "Dharani Dharan", "Madhubalan G", "Monalisa Sharma",
  "Other (Please inform RO QA Team)"
];

// CE Names
const ceNames = [
  "Ishanava Bhadury", "Animesh Mohan", "Kritika Murpana", "Mummidi Mounika",
  "Bhumika Shinde", "Prakrati Choudhary", "Shubham Kumar Singh", "Simran Shaw",
  "Amey Sathe", "Jay Sanjay Mogare", "Aishwarya M S", "Amulya Chimaniya",
  "Parneet Randhawa", "Praseetha Padmanaban", "Saptaparna Chatterjee", "Vanshika Ahuja",
  "Blesson Paul", "Simrandeep Kaur", "Abhinav Nair", "Aleena John", "Aliya Mehar",
  "Denzil Dsilva", "Khushi Chopra", "Mallika More", "Manasi Rao", "Monalisa Das",
  "Nithin Bharath Kumar", "Sameer Bhalerao", "Sathvikesh R", "Abhinav Mishra",
  "Amanda Liza Dympep", "Banupriya S", "Risalan Shullai", "Alexis Majaw", "Ashpreet Kaur",
  "Omair Athar Danyal", "Job Mathew", "Nahdha Shakkeer", "Nikita Susan D Cunha",
  "Sanvi Mishra", "Akash Asija", "Anamika Kumari", "Anisha Maben", "Sahana Bhushan",
  "Mohit Kumar", "Sahil Kumar", "Sanjana Gurung", "Shreyas G", "Shruti Pandey",
  "Rohan Thakur", "Other (Please inform RO QA Team)"
];

// Utility
function populateDropdown(dropdown, options) {
  dropdown.innerHTML = '<option value="">— select —</option>';
  options.forEach(option => {
    dropdown.innerHTML += `<option value="${option}">${option}</option>`;
  });
}

function updateOptionsForTeam(team) {
  if (team === "RO") {
    populateDropdown(errorTypeDropdown, roErrorTypes);
    populateDropdown(nameDropdown, roNames);
  } else {
    populateDropdown(errorTypeDropdown, ceErrorTypes);
    populateDropdown(nameDropdown, ceNames);
  }
}

// On Team Dropdown Change
teamDropdown.addEventListener("change", () => {
  const selectedTeam = teamDropdown.value;
  updateOptionsForTeam(selectedTeam);
});

// Initial load
updateOptionsForTeam(teamDropdown.value);

// Form submission
document.getElementById("error-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const team = teamDropdown.value;
  const status = document.getElementById("status");
  status.style.display = "none";

  const data = {
    team: team,
    bid: form.bid.value.trim(),
    error_type: form.error_type.value,
    description: form.description.value.trim(),
    error_done_by: form.error_done_by.value
  };

  try {
    const user = await client.get("currentUser");
    data.submittedBy = user.currentUser.name;
    data.userId = user.currentUser.id;

    await client.request({
      url: SCRIPT_URL,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(data)
    });

    form.reset();
    updateOptionsForTeam(teamDropdown.value);
    status.textContent = "✅ Submission logged successfully.";
    status.style.color = "green";
    status.style.display = "block";

    setTimeout(() => { status.style.display = "none"; }, 3000);
  } catch (err) {
    console.error("Error:", err);
    status.textContent = "❌ Submission failed.";
    status.style.color = "red";
    status.style.display = "block";

    setTimeout(() => { status.style.display = "none"; }, 4000);
  }
});
