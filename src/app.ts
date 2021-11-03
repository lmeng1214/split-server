import express from 'express';
import {getAllArticles} from './queries';

const app = express();
const port = process.env.PORT || 8080;

app.get('/', (_, res) => {
  res.status(200).send('OK!');
});

app.get('/selectAll', async (_, res) => {
  console.log('GET /selectAll');
  res.status(200).send(await getAllArticles());
});

app.listen(port, () => console.log(`Running at http://localhost:${port}`));
