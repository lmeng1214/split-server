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

//Table Creation Queries
const createArticlesTable = async () => {
  await server.raw('CREATE TABLE IF NOT EXISTS articles (' +
        'article_id uuid PRIMARY KEY, ' +
        'source_id VARCHAR, ' +
        'topic_id INT, ' +
        'title VARCHAR, ' +
        'url VARCHAR,' +
        'pub_date TIMESTAMP' +
        ')');
};

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
  await server.raw('CREATE TABLE IF NOT EXISTS Favorites (' +
      'article_id INT REFERENCES Articles (article_id) ON UPDATE CASCADE ON DELETE CASCADE, ' +
      'account_id INT REFERENCES Accounts (account_id) ON UPDATE CASCADE, ' +
      'CONSTRAINT favKey PRIMARY KEY (article_id, account_id)' +
      ')');
};

//Article Queries
const getAllArticles = async () => {
  console.log('@query getAllArticles');
  return server.select().table('articles');
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

//Login Queries
const insertUser = async (req : any) => {
  console.log('@query insertUser');
  console.log(req.body)
  console.log(req.body.account_id)
  return server('accounts').insert({account_id: req.body.account_id});
};

const getUser = async (req : any) => {
  console.log('@query getUser');
  console.log(req.body)
  console.log(req.body.account_id)
  console.log(Number(req.body.account_id))
  return server.table('accounts').where({account_id: req.body.account_id}).select();
}

function pick_row (rows : any)
{
  if (! rows.length) return null
  return rows[0];
}

//Favorite Queries
const updateFavorite = async (req : any, res : any) => {
  console.log('@query updateFavorite');
  console.log(req.body)
  console.log(req.body.article_id)
  console.log(req.body.account_id)

  return server('favorites').select('*')
      .where({article_id: req.body.article_id, account_id: req.body.account_id})
      .then(pick_row).then(result => {
        console.log(result)
        let response;
        if(result == null) {
          response = server('favorites').insert({article_id: req.body.article_id, account_id: req.body.account_id});
          res.send("Inserted")
        }
        else {
          response = server('favorites').where({article_id: req.body.article_id, account_id: req.body.account_id}).del();
          res.send("Deleted")
        }
        return response
      })
};

//Search Queries
const getSortedArticles = async (req : any) => {
  console.log('@query getGroupedArticles');
  console.log(req.body)
  console.log(req.body.name)
  console.log(req.body.order)
  return server.select().table('articles').orderBy(req.body.name, req.body.order);
};

export {createArticlesTable, createAccountsTable, createFavoritesTable, getAllArticles, insertArticle,
  deleteArticle, insertUser, getUser, updateFavorite, getSortedArticles};