# URL Shortster

A Simple NodeJS App for APIs of shortening long URLs.<br>
All the urls (long url & short url) and user emails are stored in `db.json` which acts as a simple db.


## How to run

After cloning the repo, please run the followings in terminal.

```bash
npm install
npm start
npm test
```

## Endpoints

#### /submit<br>

HTTP Post API for submitting urls.<br>
```
request body:
{
  email: USER EMAIL,
  shortUrl: CUSTOM SHORT URL,
  longUrl: CUSTOM LONG URL,
}
```

#### /:shortUrl/stats<br>

HTTP Get API for getting stats of urls.<br>
```
request param:
  shortUrl: CUSTOM SHORT URL,
```

#### /:shortUrl<br>

HTTP Get API for redirecting to long url, if short url exists.<br>
```
request param:
  shortUrl: CUSTOM SHORT URL,
```


## Assumption
Just a simple backend app with no frontend.