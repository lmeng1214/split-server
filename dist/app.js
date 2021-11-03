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
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.get('/', (_, res) => {
    res.status(200).send('OK!');
});
app.get('/selectAll', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('GET /selectAll');
    res.status(200).send(yield (0, queries_1.getAllArticles)());
}));
app.listen(port, () => console.log(`Running at http://localhost:${port}`));
//# sourceMappingURL=app.js.map