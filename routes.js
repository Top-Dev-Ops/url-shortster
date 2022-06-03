const express = require('express')
const router = express.Router()

const {
  submit,
  redirect,
  stats,
  _delete
} = require('./controller')

router.post('/submit', submit)
router.get('/:shortUrl', redirect)
router.get('/:shortUrl/stats', stats)
router.post('/delete', _delete)

module.exports = router