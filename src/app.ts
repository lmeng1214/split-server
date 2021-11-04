import express from 'express';
import {getAllArticles, insertArticle, deleteArticle} from './queries';

const cors = require('cors')
const app = express();
app.use(cors())
app.options('*', cors()) // allows preflight for POST, PUT, DELETE

app.use(express.json());

const port = process.env.PORT || 8080;

app.get('/', (_, res) => {
  res.status(200).send('OK!');
});

app.get('/selectAll', async (_, res) => {
  console.log('GET /selectAll');
  res.status(200).send(await getAllArticles());
});

app.post('/insertArticle', async (_, res) => {
  console.log('POST /insertArticle');
  res.status(200).send(await insertArticle(_));
});

app.post('/deleteArticle', async (_, res) => {
  console.log('POST /deleteArticle');
  res.status(204).send(await deleteArticle(_));
});

app.listen(port, () => console.log(`Running at http://localhost:${port}`));
