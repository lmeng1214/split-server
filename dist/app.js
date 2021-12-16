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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const queries_1 = require("./queries");
const cors = require('cors');
const app = (0, express_1.default)();
app.use(cors());
app.options('*', cors()); // allows preflight for POST, PUT, DELETE
app.use(express_1.default.json());
const port = process.env.PORT || 8080;
(0, queries_1.createAccountsTable)();
(0, queries_1.createFavoritesTable)();
(0, queries_1.createSearchStatement)();
// Article Queries
app.get('/numTopics', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send(yield (0, queries_1.getNumTopics)(_));
}));
app.get('/', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    /* Homepage Query */
    console.log('GET /');
    res.status(200).send(yield (0, queries_1.getArticles)());
}));
app.post('/insertArticle', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('POST /insertArticle');
    res.status(200).send(yield (0, queries_1.insertArticle)(_));
}));
app.post('/deleteArticle', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('POST /deleteArticle');
    res.status(204).send(yield (0, queries_1.deleteArticle)(_));
}));
// Login Queries
app.post('/insertUser', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('POST /insertUser');
    res.status(200).send(yield (0, queries_1.insertUser)(_));
}));
app.post('/getUser', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('POST /getUser');
    res.status(200).send(yield (0, queries_1.getUser)(_));
}));
app.post('/updateFavorite', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('POST /updateFavorite');
    yield (0, queries_1.updateFavorite)(_, res);
}));
app.post('/search', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('POST getSortedArticles');
    res.status(200).send(yield (0, queries_1.getSortedArticles)(_));
}));
app.post('/getByKeyword', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('POST getByKeyword');
    res.status(200).send(yield (0, queries_1.getArticleByWord)(_));
}));
app.listen(port, () => console.log(`Running at http://localhost:${port}`));
//# sourceMappingURL=app.js.map