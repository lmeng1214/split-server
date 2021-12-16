"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNumTopics = exports.getArticleByWord = exports.getSortedArticles = exports.updateFavorite = exports.getUser = exports.insertUser = exports.deleteArticle = exports.insertArticle = exports.getArticles = exports.createSearchStatement = exports.createFavoritesTable = exports.createAccountsTable = void 0;
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
const createAccountsTable = () => __awaiter(void 0, void 0, void 0, function* () {
    yield server.raw('CREATE TABLE IF NOT EXISTS Accounts (' +
        'account_id INT PRIMARY KEY UNIQUE, ' +
        'username VARCHAR ( 50 )' +
        // 'email VARCHAR ( 50 ), ' +
        // 'password VARCHAR ( 50 ), ' +
        // 'creation_date DATE, ' +
        ')');
});
exports.createAccountsTable = createAccountsTable;
const createFavoritesTable = () => __awaiter(void 0, void 0, void 0, function* () {
    yield server.raw('CREATE TABLE IF NOT EXISTS Favorites2 (' +
        'article_id uuid REFERENCES Articles (article_id) ' +
        'ON UPDATE CASCADE ON DELETE CASCADE, ' +
        'account_id INT REFERENCES Accounts (account_id) ON UPDATE CASCADE, ' +
        'CONSTRAINT favKey2 PRIMARY KEY (article_id, account_id)' +
        ')');
});
exports.createFavoritesTable = createFavoritesTable;
// Prepared Statement Creation
const createSearchStatement = () => __awaiter(void 0, void 0, void 0, function* () {
    yield server.raw('PREPARE search_articles(text) AS ' +
        'SELECT * FROM articles LEFT OUTER JOIN sources ' +
        'ON articles.source_id = sources.source_id ' +
        'WHERE articles.title ILIKE \'%\' || $1 || \'%\';');
});
exports.createSearchStatement = createSearchStatement;
// Article Queries
const getArticles = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('@query getArticles');
    return server('articles').leftOuterJoin('sources', 'articles.source_id', 'sources.source_id');
});
exports.getArticles = getArticles;
const insertArticle = (req) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.insertArticle = insertArticle;
const deleteArticle = (req) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('@query deleteArticle');
    console.log(req.body);
    console.log(req.body.article_id);
    console.log(Number(req.body.article_id));
    return server('articles').where({ article_id: req.body.article_id }).del();
});
exports.deleteArticle = deleteArticle;
// Login Queries
const insertUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('@query insertUser');
    console.log(req.body);
    console.log(req.body.account_id);
    return server('accounts').insert({ account_id: req.body.account_id });
});
exports.insertUser = insertUser;
const getUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('@query getUser');
    console.log(req.body);
    console.log(req.body.account_id);
    console.log(Number(req.body.account_id));
    return server.table('accounts').where({ account_id: req.body.account_id }).select();
});
exports.getUser = getUser;
function pick_row(rows) {
    if (!rows.length)
        return null;
    return rows[0];
}
// Favorite Queries
const updateFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('@query updateFavorite');
    console.log(req.body);
    console.log(req.body.article_id);
    console.log(req.body.account_id);
    return server('favorites2').select('*')
        .where({ article_id: req.body.article_id, account_id: req.body.account_id })
        .then(pick_row).then((result) => {
        console.log(result);
        let response;
        if (result == null) {
            response = server('favorites2').insert({ article_id: req.body.article_id, account_id: req.body.account_id });
            res.send('Inserted');
        }
        else {
            response = server('favorites2').where({ article_id: req.body.article_id, account_id: req.body.account_id }).del();
            res.send('Deleted');
        }
        return response;
    });
});
exports.updateFavorite = updateFavorite;
// Search Queries
const getSortedArticles = (req) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('@query getGroupedArticles');
    console.log(req.body);
    console.log(req.body.name);
    console.log(req.body.order);
    return server.select().table('articles').orderBy(req.body.name, req.body.order);
});
exports.getSortedArticles = getSortedArticles;
const getArticleByWord = (req) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('@query getArticleByWord');
    console.log(req.body.word);
    return server.raw('EXECUTE search_articles(\'' + req.body.word + '\');');
});
exports.getArticleByWord = getArticleByWord;
const getNumTopics = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return server.raw('SELECT count(DISTINCT articles.topic_id) FROM articles;');
});
exports.getNumTopics = getNumTopics;
//# sourceMappingURL=queries.js.map