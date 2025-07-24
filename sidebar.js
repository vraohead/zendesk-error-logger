const client = ZAFClient.init();

// ✅ Separate Script URLs for RO and CE
const SCRIPT_URL_RO = "https://script.google.com/macros/s/AKfycbzecRizo1W7MqfIbHdbNXoGAiEVrNjmWSh6I3DYs9TB7l9PIYWHnUxOI0BUUro7R0rqcA/exec";
const SCRIPT_URL_CE = "https://script.google.com/macros/s/AKfycbxveriphRqZD10UmOQhPz056pUpHl3vJozPgR1TTVDxISrxcDU2yad1gkCPvh-zwb91nw/exec";

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
  "Wrong Information shared", "Failed to raise the guest issue with the necessary team.",
  "Did not action callback/follow up/e-mail as per the requirement.", "Did not add follow up tag",
  "No response/inactivity", "other issues", "Delayed response to the CX", "Lack of product/service knowledge",
  "Did not follow closing protocol/ force closed", "Did not follow SOP correctly", "Did not use DSS/ used incorrect DSS",
  "Requested incorrect ETA", "Lack of explanation", "Raised a CE ping instead of self action"
];

// RO Names
const roNames = [
  "Aayushi Kanjilal", "Abhay Singh", "Akshay Chandrahas", "Akshita Saikia",
  "Ankit Mishra", "Ankita Singh", "Arun Pratap Singh", "Arunish Kumar Parashar", "Ashish Kumar",
  "Ayush Shukla", "Charan Shetti", "Chetan Bhaskar", "Devyani Parihar", "Dharani Dharan",
  "Firdous Tabassum", "Giridharan Srinivasan", "Govind D", "Himanshu Dwivedi", "Jyoti Jaiswal",
  "Kriti Singh", "Madhubalan G", "Manisha Lakhani", "Mariya Murtaza", "Mervin Vineeth S",
  "Mohamed Rizwan", "Monalisa Sharma", "Mudit Somani", "Nandita Ambwani",
  "Niharika Basavaraj",  "Poushali Choudhury","Pranjali Dhongde", "Priyadarshini Rangaraj", "Rishabh Saraf", "Rithik Lobo", "Rohan Thakur",
  "Sai Vamsi", "Saroj Sapkota", "Sarthak Gedam", "Sarthak Mishra", "Sonal Jaiswal",
  "Stefy Yohannan", "Steve Varghese", "Sujan A B", "Surabhi Detani", "Suvashis Kundu",
  "Tanisha Saraogi", "Vaishali Bisht", "Other (Please inform RO QA Team)"
];

// CE Names
const ceNames = [
  "Abhinav Mishra", "Abhinav Nair", "Aishwarya M S", "Akash Asija", "Aleena John",
  "Alexis Majaw", "Aliya Mehar", "Amanda Liza Dympep", "Amey Sathe", "Amulya Chimaniya",
  "Anamika Kumari", "Animesh Mohan", "Anisha Maben", "Ashpreet Kaur", "Banupriya S",
  "Bhumika Shinde", "Blesson Paul", "Denzil Dsilva", "Ishanava Bhadury", "Jay Sanjay Mogare",
  "Job Mathew", "Kritika Murpana", "Khushi Chopra", "Mallika More", "Manasi Rao",
  "Mummidi Mounika", "Mohit Kumar", "Monalisa Das", "Nahdha Shakkeer", "Nikita Susan D Cunha",
  "Nithin Bharath Kumar", "Omair Athar Danyal", "Parneet Randhawa", "Prakrati Choudhary",
  "Praseetha Padmanaban", "Risalan Shullai", "Rohan Thakur", "Sahana Bhushan", "Sahil Kumar",
  "Sameer Bhalerao", "Sanjana Gurung", "Sanvi Mishra", "Saptaparna Chatterjee", "Sathvikesh R",
  "Shreyas G", "Shruti Pandey", "Shubham Kumar Singh", "Simran Shaw", "Simrandeep Kaur",
  "Sohan Lal", "Vanshika Ahuja", "Other (Please inform CE QA Team)"
];

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

teamDropdown.addEventListener("change", () => {
  const selectedTeam = teamDropdown.value;
  updateOptionsForTeam(selectedTeam);
});

updateOptionsForTeam(teamDropdown.value); // On load

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

    const scriptUrl = team === "CE" ? SCRIPT_URL_CE : SCRIPT_URL_RO;

    await client.request({
      url: scriptUrl,
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
