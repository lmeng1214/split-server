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
exports.deleteArticle = exports.insertArticle = exports.getAllArticles = exports.createArticlesTable = void 0;
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
const createArticlesTable = () => __awaiter(void 0, void 0, void 0, function* () {
    yield server.raw('CREATE TABLE IF NOT EXISTS articles (' +
        'article_id uuid PRIMARY KEY, ' +
        'source_id VARCHAR, ' +
        'topic_id INT, ' +
        'title VARCHAR, ' +
        'url VARCHAR,' +
        'pub_date TIMESTAMP' +
        ')');
});
exports.createArticlesTable = createArticlesTable;
const getAllArticles = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('@query getAllArticles');
    return server.select().table('articles');
});
exports.getAllArticles = getAllArticles;
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
//# sourceMappingURL=queries.js.map