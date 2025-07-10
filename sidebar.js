const client = ZAFClient.init();
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyMejEdgeSTo5OJL4YES7zXbjdoakvNcs_EM_H_TnJYnEsruYg31zNaRGZVu8WRHsXIWA/exec';

const errorTypeDropdown = document.getElementById('error_type');
const nameDropdown = document.getElementById('error_done_by');
const teamRadios = document.querySelectorAll('input[name="team"]');

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

const ceNames = [
  "Abhinav Mishra", "Abhinav Nair", "Aishwarya M S", "Akash Asija", "Aleena John",
  "Aliya Mehar", "Amey Sathe", "Amanda Liza Dympep", "Amulya Chimaniya", "Anamika Kumari",
  "Animesh Mohan", "Anisha Maben", "Ashpreet Kaur", "Banupriya S", "Bhumika Shinde",
  "Blesson Paul", "Denzil Dsilva", "Ishanava Bhadury", "Jay Sanjay Mogare", "Job Mathew",
  "Khushi Chopra", "Kritika Murpana", "Mallika More", "Manasi Rao", "Mummidi Mounika",
  "Nahdha Shakkeer", "Nikita Susan D Cunha", "Nithin Bharath Kumar", "Parneet Randhawa",
  "Prakrati Choudhary", "Praseetha Padmanaban", "Risalan Shullai", "Rohan Thakur",
  "Sahana Bhushan", "Sahil Kumar", "Sameer Bhalerao", "Sampath Majaw", "Sanjana Gurung",
  "Saptaparna Chatterjee", "Sathvikesh R", "Shaan G", "Shreyas G", "Shruti Pandey",
  "Simran Shaw", "Simrandeep Kaur", "Vanshika Ahuja", "Other (Please inform RO QA Team)"
];

function populateOptions(dropdown, options) {
  dropdown.innerHTML = '<option value="">— select —</option>';
  options.forEach(name => {
    dropdown.innerHTML += `<option value="${name}">${name}</option>`;
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
  radio.addEventListener('change', updateTeamOptions);
});

updateTeamOptions(); // initialize on load

// Submission handler
document.getElementById('error-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById('status');
  status.style.display = 'none';
  status.style.color = 'green';

  const team = document.querySelector('input[name="team"]:checked').value;

  const data = {
    team,
    bid: form.bid.value.trim(),
    error_type: form.error_type.value,
    description: form.description.value.trim(),
    error_done_by: form.error_done_by.value
  };

  try {
    const user = await client.get('currentUser');
    data.submittedBy = user.currentUser.name;
    data.userId = user.currentUser.id;

    await client.request({
      url: SCRIPT_URL,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data)
    });

    form.reset();
    updateTeamOptions();
    status.textContent = '✅ Submission logged successfully.';
    status.style.display = 'block';

    setTimeout(() => {
      status.style.display = 'none';
    }, 3000);
  } catch (err) {
    console.error('Submission error:', err);
    status.textContent = '❌ Submission failed. Please try again.';
    status.style.color = 'red';
    status.style.display = 'block';

    setTimeout(() => {
      status.style.display = 'none';
      status.style.color = 'green';
    }, 4000);
  }
});
