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
exports.getAllArticles = exports.createArticlesTable = void 0;
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
        port: '5433',
    },
};
/* Double check that you have the credential file! */
const server = Knex(configuration);
const createArticlesTable = () => __awaiter(void 0, void 0, void 0, function* () {
    yield server.raw('CREATE TABLE IF NOT EXISTS Articles (' +
        'article_id INT PRIMARY KEY, ' +
        'source_id INT, ' +
        'topic_id INT, ' +
        'title VARCHAR ( 50 ), ' +
        'url VARCHAR ( 255 ),' +
        'pub_date TIMESTAMP' +
        ')');
});
exports.createArticlesTable = createArticlesTable;
const getAllArticles = () => __awaiter(void 0, void 0, void 0, function* () {
    return server.select().table('articles');
});
exports.getAllArticles = getAllArticles;
//# sourceMappingURL=queries.js.map