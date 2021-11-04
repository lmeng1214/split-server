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
const server = Knex(configuration);

const createArticlesTable = async () => {
  await server.raw('CREATE TABLE IF NOT EXISTS Articles (' +
      'article_id INT PRIMARY KEY, ' +
      'source_id INT, ' +
      'topic_id INT, ' +
      'title VARCHAR ( 50 ), ' +
      'url VARCHAR ( 255 ),' +
      'pub_date TIMESTAMP' +
      ')');
};

const getAllArticles = async () => {
  console.log('@query getAllArticles');
  return server.select().table('articles');
};

const insertArticle = async (req : any) => {
  var date = new Date();
  console.log('@query insertArticle');
  console.log(req.body)
  return server('articles').insert({article_id: req.body.article_id, source_id: req.body.topic_id, topic_id: req.body.article_id, title: req.body.title, url: req.body.url, pub_date: date.toISOString()});
};

const deleteArticle = async (req : any) => {
  console.log('@query deleteArticle');
  console.log(req.body)
  console.log(req.body.article_id)
  console.log(Number(req.body.article_id))
  return server('articles').where({article_id: req.body.article_id}).del();
};

export {createArticlesTable, getAllArticles, insertArticle, deleteArticle};
