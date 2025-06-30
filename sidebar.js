const client = ZAFClient.init();

// 👇 This is your new PROXY endpoint
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyMejEdgeSTo5OJL4YES7zXbjdoakvNcs_EM_H_TnJYnEsruYg31zNaRGZVu8WRHsXIWA/exec';

document.getElementById('error-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const form = e.target;

  const data = {
    bid: form.bid.value,
    error_type: form.error_type.value,
    description: form.description.value,
    error_done_by: form.error_done_by.value
  };

  try {
    const user = await client.get('currentUser');
    data.submittedBy = user.currentUser.name;
    data.userId = user.currentUser.id;

    // ✅ This uses Zendesk’s secure client.request method (no CORS issues)
    await client.request({
      url: SCRIPT_URL,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data)
    });

    form.reset();
    document.getElementById('status').textContent = '✅ Logged successfully!';
  } catch (err) {
    document.getElementById('status').textContent = '❌ Error: ' + err.message;
    console.error('Zendesk log failed:', err);
  }
});
