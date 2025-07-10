const client = ZAFClient.init();
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyMejEdgeSTo5OJL4YES7zXbjdoakvNcs_EM_H_TnJYnEsruYg31zNaRGZVu8WRHsXIWA/exec";

// Full RO + CE Error Types
const roErrorTypes = [
  "Manual error", "Did not follow BI", "Wrong Alts sent", "Wrong refund",
  "Wrong macro", "Wrong tickets", "Double booking", "Incomplete FF",
  "No SOP", "Improper action", "RO TAT", "Wrong DSS", "Others"
];

const ceErrorTypes = [
  "Wrong Information shared",
  "Failed to raise the guest issue with the necessary team.",
  "Did not action callback/follow up/e-mail as per the requirement.",
  "Did not add follow up tag",
  "No response/inactivity",
  "other issues",
  "Delayed response to the CX",
  "Lack of product/service knowledge",
  "Did not follow closing protocol/ force closed",
  "Did not follow SOP correctly",
  "Did not use DSS/ used incorrect DSS",
  "Requested incorrect ETA",
  "Lack of explanation",
  "Raised a CE ping instead of self action"
];

// RO Names
const roNames = [
  "Aacim Zia", "Aayushi Kanjilal", "Abhay Singh", "Akshay Chandrahas", "Akshita Saikia",
  "Ankita Singh", "Ankit Mishra", "Arun Pratap Singh", "Arunish Kumar Parashar",
  "Ashish Kumar", "Ayush Shukla", "Charan Shetti", "Chetan Bhaskar", "Devyani Parihar",
  "Dharani Dharan", "Firdous Tabassum", "Giridharan Srinivasan", "Govind D",
  "Himanshu Dwivedi", "Jyoti Jaiswal", "Kriti Singh", "Madhubalan G", "Manisha Lakhani",
  "Mariya Murtaza", "Mervin Vineeth S", "Monalisa Sharma", "Mousumi Maity",
  "Mudit Somani", "Mohamed Rizwan", "Nandita Ambwani", "Niharika Basavaraj",
  "Poushali Choudhury", "Pranjali Dhongde", "Rishabh Saraf", "Rithik Lobo",
  "Rohan Thakur", "Sai Vamsi", "Saarth Soparkar", "Saroj Sapkota", "Sarthak Gedam",
  "Sarthak Mishra", "Sonal Jaiswal", "Stefy Yohannan", "Steve Varghese", "Sujan A B",
  "Surabhi Detani", "Suvashis Kundu", "Vaishali Bisht", "Other (Please inform RO QA Team)"
];

// CE Names
const ceNames = [
  "Ishanava Bhadury", "Animesh Mohan", "Kritika Murpana", "Mummidi Mounika", "Bhumika Shinde",
  "Prakrati Choudhary", "Shubham Kumar Singh", "Simran Shaw", "Amey Sathe", "Jay Sanjay Mogare",
  "Aishwarya M S", "Amulya Chimaniya", "Parneet Randhawa", "Praseetha Padmanaban",
  "Saptaparna Chatterjee", "Vanshika Ahuja", "Blesson Paul", "Simrandeep Kaur", "Abhinav Nair",
  "Aleena John", "Aliya Mehar", "Denzil Dsilva", "Khushi Chopra", "Mallika More", "Manasi Rao",
  "Monalisa Das", "Nithin Bharath Kumar", "Sameer Bhalerao", "Sathvikesh R", "Abhinav Mishra",
  "Amanda Liza Dympep", "Banupriya S", "Risalan Shullai", "Alexis Majaw", "Ashpreet Kaur",
  "Omair Athar Danyal", "Job Mathew", "Nahdha Shakkeer", "Nikita Susan D Cunha", "Sanvi Mishra",
  "Akash Asija", "Anamika Kumari", "Anisha Maben", "Sahana Bhushan", "Mohit Kumar", "Sahil Kumar",
  "Sanjana Gurung", "Shreyas G", "Shruti Pandey", "Rohan Thakur", "Other (Please inform CE QA Team)"
];

function populateOptions(dropdown, options) {
  dropdown.innerHTML = '<option value="">— select —</option>';
  options.forEach(name => {
    dropdown.innerHTML += `<option value="${name}">${name}</option>`;
  });
}

function updateTeamOptions() {
  const team = document.querySelector('input[name="team"]:checked').value;
  if (team === "RO") {
    populateOptions(document.getElementById("error_type"), roErrorTypes);
    populateOptions(document.getElementById("error_done_by"), roNames);
  } else {
    populateOptions(document.getElementById("error_type"), ceErrorTypes);
    populateOptions(document.getElementById("error_done_by"), ceNames);
  }
}

document.querySelectorAll('input[name="team"]').forEach(radio =>
  radio.addEventListener("change", updateTeamOptions)
);

updateTeamOptions(); // Init on load

document.getElementById("error-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const team = document.querySelector('input[name="team"]:checked').value;
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
    updateTeamOptions();
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
