import express from 'express';

const app = express();

const port = process.env.PORT || 8080;

app.get('/', (_, res) => {
  res.status(200).send('OK!');
});

app.get('/selectAll', async (_, res) => {
  res.status(200).send('SERVING OK');
  console.log('Status 200 sent.');
});

app.listen(port, () => console.log(`Running at http://localhost:${port}`));
