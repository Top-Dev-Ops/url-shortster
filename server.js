const express = require('express')
const cors = require('cors')

const app = express()

// cors
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/ping", (req, res) => {
  res.send("Ping")
})

const routes = require('./routes')
app.use('/', routes)

module.exports = app.listen(3000, () => {
  console.log(`App listening on port 3000`)
})
