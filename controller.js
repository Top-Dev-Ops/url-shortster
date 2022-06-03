const fs = require('fs')
const crypto = require('crypto')

exports.submit = (req, res) => {
  let { email, shortUrl, longUrl } = req.body
  let url
  try {
    url = new URL(longUrl)
  } catch {
    return res.status(500).send('Long url must be valid url.')
  }
  if (!shortUrl) {
    shortUrl = crypto.randomBytes(3).toString('hex')
  } else if (shortUrl.length < 5) {
    return res.status(500).send('Short url must be at least 4 letters long.')
  }
  let data = JSON.parse(fs.readFileSync('db.json'))
  let index = -1
  if (!data[email]) {
    data = {
      ...data,
      [email]: [
        {
          shortUrl,
          longUrl,
          createdAt: new Date(),
          visitedAt: new Date(),
          visited: 0
        }
      ]
    }
  } else {
    index = data[email].findIndex(dat => dat.shortUrl === shortUrl)
    if (index >= 0) {
      return res.status(500).send(`Short url ${shortUrl} already exists.`)
    }
    index = data[email].findIndex(dat => dat.longUrl === longUrl)
    if (index >= 0) {
      data = {
        ...data,
        [email]: [
          ...data[email].slice(0, index),
          {
            ...data[email][index],
            shortUrl,
            longUrl,
          },
          ...data[email].slice(index+1)
        ]
      }
    } else {
      data = {
        ...data,
        [email]: [
          ...data[email],
          {
            shortUrl,
            longUrl,
            createdAt: new Date(),
            visitedAt: new Date(),
            visited: 0
          }
        ]
      }
    }
  }
  fs.writeFileSync('db.json', JSON.stringify(data))
  return res.status(200).send(data[email])
}

exports.redirect = (req, res) => {
  const { shortUrl } = req.params
  let data = JSON.parse(fs.readFileSync('db.json'))
  let email
  Object.keys(data).forEach(key => {
    result = data[key].find(dat => dat.shortUrl === shortUrl)
    if (result) {
      email = key
    }
  })
  if (!result) {
    return res.send(`No short url ${shortUrl} found.`)
  }
  const { longUrl } = result
  let index = data[email].findIndex(dat => dat.shortUrl === shortUrl)
  if (index >= 0) {
    data = {
      ...data,
      [email]: [
        ...data[email].slice(0, index),
        {
          ...data[email][index],
          visitedAt: new Date(),
          visited: data[email][index]['visited']+1
        },
        ...data[email].slice(index+1)
      ]
    }
    fs.writeFileSync('db.json', JSON.stringify(data))
  }

  res.redirect(longUrl)
}

exports.stats = (req, res) => {
  const { shortUrl } = req.params
  const data = JSON.parse(fs.readFileSync('db.json'))
  let result
  Object.keys(data).forEach(key => {
    result =  data[key].find(dat => dat.shortUrl === shortUrl)
  })
  if (!result) {
    return res.status(500).send(`No short url ${shortUrl} found.`)
  }
  return res.send(result)
}

exports._delete = (req, res) => {
  const { email, shortUrl } = req.body
  let data = JSON.parse(fs.readFileSync('db.json'))
  if (data[email]) {
    data = {
      ...data,
      [email]: data[email].filter(dat => dat.shortUrl !== shortUrl)
    }
    fs.writeFileSync('db.json', JSON.stringify(data))
  }
  return res.send('Successfully deleted urls.')
}