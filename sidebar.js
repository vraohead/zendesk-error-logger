const client = ZAFClient.init();

// ✅ Your live Apps Script URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyMejEdgeSTo5OJL4YES7zXbjdoakvNcs_EM_H_TnJYnEsruYg31zNaRGZVu8WRHsXIWA/exec";

// Elements
const errorTypeDropdown = document.getElementById("error_type");
const nameDropdown = document.getElementById("error_done_by");
const teamRadios = document.querySelectorAll('input[name="team"]');

// Options
const roErrorTypes = [
  "Manual error", "Did not follow BI", "Wrong Alts sent", "Wrong refund",
  "Wrong macro", "Wrong tickets", "Double booking", "Incomplete FF",
  "No SOP", "Improper action", "RO TAT", "Wrong DSS", "Others"
];

const ceErrorTypes = [
  "Wrong Information shared", "Failed to raise the guest issue with the necessary team.",
  "Did not action callback/follow up/e-mail as per the requirement.",
  "Did not add follow up tag", "No response/inactivity", "other issues",
  "Delayed response to the CX", "Lack of product/service knowledge",
  "Did not follow closing protocol/ force closed", "Did not follow SOP correctly",
  "Did not use DSS/ used incorrect DSS", "Requested incorrect ETA",
  "Lack of explanation", "Raised a CE ping instead of self action"
];

const roNames = [ "Aacim Zia", "Aayushi Kanjilal", "Abhay Singh", /* ... */, "Other (Please inform RO QA Team)" ];
const ceNames = [ "Abhinav Mishra", "Abhinav Nair", "Aishwarya M S", /* ... */, "Other (Please inform RO QA Team)" ];

// Update dropdowns based on selected team
function populateOptions(dropdown, options) {
  dropdown.innerHTML = '<option value="">— select —</option>';
  options.forEach(opt => {
    dropdown.innerHTML += `<option value="${opt}">${opt}</option>`;
  });
}

function updateTeamOptions() {
  const selectedTeam = document.querySelector('input[name="team"]:checked').value;
  if (selectedTeam === "RO") {
    populateOptions(errorTypeDropdown, roErrorTypes);
    populateOptions(nameDropdown, roNames);
  } else {
    populateOptions(errorTypeDropdown, ceErrorTypes);
    populateOptions(nameDropdown, ceNames);
  }
}

teamRadios.forEach(radio => {
  radio.addEventListener("change", updateTeamOptions);
});

updateTeamOptions(); // Initialize on load

// Handle form submit
document.getElementById("error-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById("status");
  status.style.display = "none";
  status.style.color = "green";

  // ✅ GET SELECTED TEAM
  const team = document.querySelector('input[name="team"]:checked').value;

  const data = {
    team: team, // ✅ INCLUDE TEAM VALUE HERE
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
    status.style.display = "block";

    setTimeout(() => {
      status.style.display = "none";
    }, 3000);
  } catch (err) {
    console.error("Submission error:", err);
    status.textContent = "❌ Submission failed. Please try again.";
    status.style.color = "red";
    status.style.display = "block";

    setTimeout(() => {
      status.style.display = "none";
      status.style.color = "green";
    }, 4000);
  }
});
