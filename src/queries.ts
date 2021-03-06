/*
 * This file is where all queries to the DB should be kept.
 */
const Knex = require('knex');

const configuration = {
  client: 'pg',
  connection: {
    user: 'prod-sql@split-327923.iam',
    password: 'autofill',
    database: 'postgres',
    host: '127.0.0.1',
    port: '5432',
  },
};

/* Double check that you have the credential file! */
// eslint-disable-next-line new-cap
const server = Knex(configuration);

// Table Creation Queries
const createAccountsTable = async () => {
  await server.raw('CREATE TABLE IF NOT EXISTS Accounts (' +
      'account_id INT PRIMARY KEY UNIQUE, ' +
      'username VARCHAR ( 50 )' +
      // 'email VARCHAR ( 50 ), ' +
      // 'password VARCHAR ( 50 ), ' +
      // 'creation_date DATE, ' +
      ')');
};

const createFavoritesTable = async () => {
  await server.raw('CREATE TABLE IF NOT EXISTS Favorites2 (' +
      'article_id uuid REFERENCES Articles (article_id) ' +
      'ON UPDATE CASCADE ON DELETE CASCADE, ' +
      'account_id INT REFERENCES Accounts (account_id) ON UPDATE CASCADE, ' +
      'CONSTRAINT favKey2 PRIMARY KEY (article_id, account_id)' +
      ')');
};

// Prepared Statement Creation
const createSearchStatement = async () => {
  await server.raw('PREPARE search_articles(text) AS ' +
      'SELECT * FROM articles LEFT OUTER JOIN sources ' +
      'ON articles.source_id = sources.source_id ' +
      'WHERE articles.title ILIKE \'%\' || $1 || \'%\';');
};

// Article Queries
const getArticles = async () => {
  console.log('@query getArticles');
  return server('articles').leftOuterJoin('sources', 'articles.source_id', 'sources.source_id');
};

const insertArticle = async (req: any) => {
  const date = new Date();
  console.log('@query insertArticle');
  console.log(req.body);
  return server('articles').insert({
    article_id: req.body.article_id,
    source_id: req.body.topic_id,
    topic_id: req.body.article_id,
    title: req.body.title,
    url: req.body.url,
    pub_date: date.toISOString(),
  });
};

const deleteArticle = async (req: any) => {
  console.log('@query deleteArticle');
  console.log(req.body);
  console.log(req.body.article_id);
  console.log(Number(req.body.article_id));
  return server('articles').where({article_id: req.body.article_id}).del();
};

// Login Queries
const insertUser = async (req : any) => {
  console.log('@query insertUser');
  console.log(req.body);
  console.log(req.body.account_id);
  return server('accounts').insert({account_id: req.body.account_id});
};

const getUser = async (req : any) => {
  console.log('@query getUser');
  console.log(req.body);
  console.log(req.body.account_id);
  console.log(Number(req.body.account_id));
  return server.table('accounts').where({account_id: req.body.account_id}).select();
};

function pick_row(rows : any) {
  if (! rows.length) return null;
  return rows[0];
}

// Favorite Queries
const updateFavorite = async (req : any, res : any) => {
  console.log('@query updateFavorite');
  console.log(req.body);
  console.log(req.body.article_id);
  console.log(req.body.account_id);

  return server('favorites2').select('*')
      .where({article_id: req.body.article_id, account_id: req.body.account_id})
      .then(pick_row).then((result) => {
        console.log(result);
        let response;
        if (result == null) {
          response = server('favorites2').insert({article_id: req.body.article_id, account_id: req.body.account_id});
          res.send('Inserted');
        } else {
          response = server('favorites2').where({article_id: req.body.article_id, account_id: req.body.account_id}).del();
          res.send('Deleted');
        }
        return response;
      });
};

// Search Queries
const getSortedArticles = async (req : any) => {
  console.log('@query getGroupedArticles');
  console.log(req.body);
  console.log(req.body.name);
  console.log(req.body.order);
  return server.select().table('articles').orderBy(req.body.name, req.body.order);
};

const getArticleByWord = async (req : any) => {
  console.log('@query getArticleByWord');
  console.log(req.body.word);

  return server.raw('EXECUTE search_articles(\'' + req.body.word + '\');');
};

const getNumTopics = async (req:any) => {
  return server.raw('SELECT count(DISTINCT articles.topic_id) FROM articles;');
};

export {
  createAccountsTable,
  createFavoritesTable,
  createSearchStatement,
  getArticles,
  insertArticle,
  deleteArticle,
  insertUser,
  getUser,
  updateFavorite,
  getSortedArticles,
  getArticleByWord,
  getNumTopics,
};
