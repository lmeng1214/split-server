import express from 'express';
import {createAccountsTable, createFavoritesTable, getAllArticles, insertArticle, deleteArticle,
  insertUser, getUser, updateFavorite, getSortedArticles} from './queries';

const cors = require('cors')
const app = express();
app.use(cors())
app.options('*', cors()) // allows preflight for POST, PUT, DELETE

app.use(express.json());

const port = process.env.PORT || 8080;

app.get('/', (_, res) => {
  res.status(200).send('OK!');
});

createAccountsTable();
createFavoritesTable();

//Article Queries
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

//Login Queries
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

app.listen(port, () => console.log(`Running at http://localhost:${port}`));
