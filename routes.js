const express = require('express')
const router = express.Router()

const {
  submit,
  redirect,
  stats
} = require('./controller')

router.post('/submit', submit)
router.get('/:shortUrl', redirect)
router.get('/:shortUrl/stats', stats)

module.exports = router