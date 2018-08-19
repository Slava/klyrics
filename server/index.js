const express = require('express');
const request = require('request');
const entities = new require('html-entities').AllHtmlEntities;
const cheerio = require('cheerio');

const app = express();

app.get('/search', (req, res) => {
  const input = req.query.q;
  request.get('https://colorcodedlyrics.com/?s=' + encodeURI(input), (_, __, text) => {
    const names = [];
    text.replace(/"entry-title">.*<a .*href="([^\s]+)".*>(.*)<\/a>/g, (match, url, name) => {
      const parts = url.split('/');
      const id = parts[parts.length - 1];
      names.push([entities.decode(name), id]);
      return '';
    });

    res.set({ 'content-type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' })
    res.end(JSON.stringify(names));
  });
});

app.get('/parse', (req, res) => {
  const id = req.query.id;
  request.get('https://colorcodedlyrics.com/' + encodeURI(id), (_, __, text) => {
    const $ = cheerio.load(text);
    const src = $('.youtube-player').attr('src');
    const parts = src.split('/');
    const videoId = parts[parts.length - 1].split('?')[0];
    const headings = Array.from($('table').find('th').map(function() { return $(this).text(); }));
    const contents = Array.from($($('table')[1]).find('td').map(function() { return $(this).html(); }));

    const lyrics = {};
    headings.forEach((heading, i) => lyrics[heading] = contents[i]);

    res.set({ 'content-type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' })
    res.end(JSON.stringify({
      videoId,
      lyrics,
    }));
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
