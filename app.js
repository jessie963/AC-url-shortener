/**
 * 路由設定:
 * 1. get /shortener (顯示表單)
 * 2. post /link (產生短網址)
 * 3. get /:hash (輸入短網址後重導向至原網址)
 */

import express from 'express';
import { engine } from 'express-handlebars';
import { getShortenedURL, getOriginalURL } from './utils/url-shortener.js';

const app = express();
const port = 3000;

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');
app.use(express.urlencoded());
app.use(express.static('public'));

// 首頁顯示表單
app.get('/', (req, res) => {
  res.redirect('/shortener');
});

app.get('/shortener', (req, res) => {
  res.render('shortener');
});

// 產生短網址
app.post('/link', (req, res) => {
  const url = req.body.url;
  const domainName = `${req.protocol}://${req.get('host')}`;  // 動態取得 domain name
  const shortenedURL = getShortenedURL(url, domainName);
  res.render('link', { shortenedURL });
});

// 重導向至原網址
app.get('/:hash', (req, res) => {
  let hash = req.params.hash;
  const domainName = `${req.protocol}://${req.get('host')}`; // 動態取得 domain name
  let redirectURL = getOriginalURL(domainName, hash);
  res.redirect(redirectURL);
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
