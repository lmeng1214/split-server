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
  return server.select().table('articles');
};

export {createArticlesTable, getAllArticles};
