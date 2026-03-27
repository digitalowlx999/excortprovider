const url = 'https://escort-provider.onrender.com/api/seed-dummy/init-seed-images-table';
fetch(url)
  .then(res => res.text().then(text => ({ status: res.status, text })))
  .then(result => {
    console.log('STATUS:', result.status);
    console.log('BODY:', result.text);
  })
  .catch(console.error);
