import express from 'express'

const app = express()

const port = process.env.PORT || 8080

app.get('/', (_, res) => {
  res.status(200).send('OK!')
})

app.listen(port, () => console.log(`Running at http://localhost:${port}`))
