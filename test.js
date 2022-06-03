const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('./server')

chai.use(chaiHttp)

const should = chai.should()

describe('URL Shortster', () => {
  it('submit new url with non-valid long url', async () => {
    const res = await chai
      .request(server)
      .post('/submit')
      .send({
        email: 'aaa@aaa.aaa',
        shortUrl: 'aaa',
        longUrl: 'aaaaaaaaaa'
      })
    res.should.have.status(500)
    res.text.should.be.eql('Long url must be valid url.')
  })

  it('submit new url with short-length short url', async () => {
    const res = await chai
      .request(server)
      .post('/submit')
      .send({
        email: 'aaa@aaa.aaa',
        shortUrl: 'aaa',
        longUrl: 'https://aaaaaa.aaaaaaa.aaaaaaa'
      })
    res.should.have.status(500)
    res.text.should.be.eql('Short url must be at least 4 letters long.')
  })

  it('submit new url with valid urls', async () => {
    let res = await chai
      .request(server)
      .post('/delete')
      .send({
        email: 'aaa@aaa.aaa',
        shortUrl: 'aaaaaaa',
      })
    res.should.have.status(200)
    res.text.should.be.eql('Successfully deleted urls.')
    res = await chai
      .request(server)
      .post('/submit')
      .send({
        email: 'aaa@aaa.aaa',
        shortUrl: 'aaaaaaa',
        longUrl: 'https://aaaaaa.aaaaaaa.aaaaaaa'
      })
    res.should.have.status(200)
    res.body.should.be.a('array')
    res.body.length.should.be.gt(0)
  })

  it('redirect to long url', async () => {
    const res = await chai
      .request(server)
      .get('/c62e01')
      .redirects(0)
    res.should.have.status(200)
  })

  it('get stats of urls', async () => {
    const res = await chai
      .request(server)
      .get('/aaaaaaa/stats')
    res.should.have.status(200)
    res.body.should.be.a('object')
    res.body.should.have.property('shortUrl')
    res.body.should.have.property('longUrl')
    res.body.should.have.property('createdAt')
    res.body.should.have.property('visitedAt')
    res.body.should.have.property('visited')
  })
})

