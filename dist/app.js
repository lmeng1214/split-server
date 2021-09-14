'use strict'
const __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const express_1 = __importDefault(require('express'))
const app = (0, express_1.default)()
const port = process.env.PORT || 8080
app.get('/', (_, res) => {
  res.status(200).send()
})
app.listen(port, () => console.log(`Running TEST at http://localhost:${port}`))
// # sourceMappingURL=app.js.map
