const client = ZAFClient.init();
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyMejEdgeSTo5OJL4YES7zXbjdoakvNcs_EM_H_TnJYnEsruYg31zNaRGZVu8WRHsXIWA/exec';

document.getElementById('error-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById('status');
  status.style.display = 'none';
  status.style.color = 'green';

  const data = {
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
    status.textContent = '✅ Submission logged successfully.';
    status.style.display = 'block';

    setTimeout(() => {
      status.style.display = 'none';
    }, 3000);
  } catch (err) {
    console.error('Submission error:', err);
    status.style.color = 'red';
    status.textContent = '❌ Something went wrong. Please try again.';
    status.style.display = 'block';

    setTimeout(() => {
      status.style.display = 'none';
      status.style.color = 'green';
    }, 4000);
  }
});
