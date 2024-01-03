require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
let contador = 0
const diccionarioUrls = {}
// Basic Configuration
app.use(express.urlencoded({ extended: false }));
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res) {
  const originalUrl = req.body.url
  const caracterSeparador = '/'
  const indiceSeparador = originalUrl.indexOf(caracterSeparador)
  let soloUrl

  if (indiceSeparador !== -1 && originalUrl[indiceSeparador+1] === caracterSeparador) {
    soloUrl = originalUrl.substring(indiceSeparador + 2)

    dns.lookup(soloUrl, (err, address, family) => {
      if (err) {
        console.error(err);
        res.json({ error: 'invalid url'})
        return;
      }
      contador++
      diccionarioUrls[contador] = originalUrl
      res.json({ original_url: originalUrl, short_url: contador})
    });
  } else {
    res.json({ error: 'invalid url'})
  }
  
})

app.get('/api/shorturl/:idUrl', (req, res) => {
  const obtenerUrl = diccionarioUrls[req.params.idUrl]
  res.redirect(obtenerUrl)
})

app.get('/test', (req, res) => {
  res.redirect('https://www.facebook.com')
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
