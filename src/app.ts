import express from 'express';

import {
  createAccountsTable,
  createFavoritesTable,
  getArticles,
  insertArticle,
  deleteArticle,
  insertUser,
  getUser,
  updateFavorite,
  getSortedArticles,
  getArticleByWord
} from './queries';

const cors = require('cors');
const app = express();
app.use(cors());
app.options('*', cors()); // allows preflight for POST, PUT, DELETE

app.use(express.json());

const port = process.env.PORT || 8080;

createAccountsTable();
createFavoritesTable();

// Article Queries
app.get('/', async (_, res) => {
  /* Homepage Query */
  console.log('GET /');
  res.status(200).send(await getArticles());
});

app.post('/insertArticle', async (_, res) => {
  console.log('POST /insertArticle');
  res.status(200).send(await insertArticle(_));
});

app.post('/deleteArticle', async (_, res) => {
  console.log('POST /deleteArticle');
  res.status(204).send(await deleteArticle(_));
});

// Login Queries
app.post('/insertUser', async (_, res) => {
  console.log('POST /insertUser');
  res.status(200).send(await insertUser(_));
});

app.post('/getUser', async (_, res) => {
  console.log('POST /getUser');
  res.status(200).send(await getUser(_));
});

app.post('/updateFavorite', async (_, res) => {
  console.log('POST /updateFavorite');
  await updateFavorite(_, res);
});

app.post('/search', async (_, res) => {
  console.log('POST getSortedArticles');
  res.status(200).send(await getSortedArticles(_));
});

app.post('/getByKeyword', async (_, res) => {
  console.log('POST getByKeyword');
  res.status(200).send(await getArticleByWord(_));
});

app.listen(port, () => console.log(`Running at http://localhost:${port}`));
