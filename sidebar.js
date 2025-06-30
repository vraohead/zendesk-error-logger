const client = ZAFClient.init();
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzecRizo1W7MqfIbHdbNXoGAiEVrNjmWSh6I3DYs9TB7l9PIYWHnUxOI0BUUro7R0rqcA/exec';

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

    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const text = await response.text();
    form.reset();
    document.getElementById('status').textContent = '✅ ' + text;
    console.log('✅ Google Script Response:', text);
  } catch (err) {
    document.getElementById('status').textContent = '❌ Error: ' + err.message;
    console.error('❌ Google Script Error:', err);
  }
});
