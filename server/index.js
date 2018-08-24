const express = require('express');
const request = require('request');
const entities = new require('html-entities').AllHtmlEntities;
const cheerio = require('cheerio');
const path = require('path');

const app = express();

app.get('/api/search', (req, res) => {
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

function getVideoId($) {
  try {
    const src = $('.youtube-player').attr('src');
    const parts = src.split('/');
    const videoId = parts[parts.length - 1].split('?')[0];
    return videoId;
  } catch(err) {
    return null;
  }
}

function getTitle($) {
  try {
    const title = $('.entry-title').map(function () { return $(this).text(); })[0];
    const matched = title.match(/(.*) – (.*)/);
    const artist = matched[1];
    const name = matched[2];

    return { artist, name };
  } catch(err) {
    return {
      artist: null,
      name: null,
    };
  }
}

function getFormattedContents(initNode) {
  function *traverseGenerator(node) {
    yield node;
    if (node.children)
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        yield *traverseGenerator(child);
      }
  }

  const it = traverseGenerator(initNode);
  let res = it.next();

  const paragraphs = [];
  const styles = new Map();
  let count = 0;
  let currentStyleId = 0;

  let currentParagraph = [];

  while (!res.done) {
    const node = res.value;
    if (node.type === 'text') {
      const line = node.data;
      if (line !== '\n')
        currentParagraph.push({line, styleId: currentStyleId});
      else {
        if (currentParagraph.length && !currentParagraph[currentParagraph.length - 1].newline)
          currentParagraph.push({ newline: true });
      }
    } else if (node.type === 'tag' && node.name === 'p') {
      if (currentParagraph.length) {
        paragraphs.push(currentParagraph);
        currentParagraph = [];
      }
    } else if (node.type === 'tag' && node.name === 'span') {
      const {style} = node.attribs;
      if (style && style.match(/color/)) {
        if (styles.has(style))
          currentStyleId = styles.get(style);
        else {
          currentStyleId = ++count;
          styles.set(style, currentStyleId);
        }
      }
    } else if (node.type === 'tag' && node.name === 'br') {
      if (currentParagraph.length && !currentParagraph[currentParagraph.length - 1].newline)
        currentParagraph.push({ newline: true });
    }

    res = it.next();
  }
  if (currentParagraph.length) {
    paragraphs.push(currentParagraph);
  }
  return paragraphs;
}

function getLyrics($) {
  try {
    const lyrics = {};
    const headings = Array.from($('table').find('th').map(function() { return $(this).text(); }));
    const contents = Array.from($($('table')[1]).find('td'));
    headings.forEach((heading, i) => lyrics[heading] = getFormattedContents(contents[i]));
    return lyrics;
  } catch(err) {
    console.log(err)
    return {};
  }
}

function getImage($) {
  try {
    let albumArt = null;

    if (!albumArt) {
      const imgs = $('img').filter(function () {
        const className = this.attribs.class;
        return className && (className.indexOf('wp-image-') !== -1 || className.indexOf('alignright') !== -1);
      }).filter(function () {
        const src = this.attribs.src;
        return src !== 'image.jpg';
      });

      const imgs2 = imgs.filter(function () {return this.attribs.class.indexOf('wp-image-') !== -1});
      if (imgs2.length)
        albumArt = imgs2[0];
      else
        albumArt = imgs[0];
    }

    return { imgSrc: albumArt.attribs.src };
  } catch (err) {
    console.log(err);
    return { imgSrc: null };
  }
}

function getMeta($) {
  try {
    const hrefs = Array.from($('.entry-meta a[rel="category tag"]').map(function () { return $(this).attr('href'); }).filter(function () { return this.indexOf('/category/') !== -1; }));

    hrefs.sort((a, b) => b.length - a.length);
    const href = hrefs[0];

    const tag = href.split('colorcodedlyrics.com/')[1];
    return { artistId: tag };
  } catch(err) {
    console.log(err);
    return { artistId: null };
  }
}

app.get('/api/parse', (req, res) => {
  const id = req.query.id;
  request.get('https://colorcodedlyrics.com/' + encodeURI(id), (_, __, text) => {
    const $ = cheerio.load(text);
    const videoId = getVideoId($);
    const {artist, name} = getTitle($);
    const lyrics = getLyrics($);
    const {artistId} = getMeta($);
    const {imgSrc} = getImage($);

    res.set({ 'content-type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' })
    res.end(JSON.stringify({
      videoId,
      lyrics,
      artist,
      name,
      artistId,
      imgSrc,
    }));
  });
});

app.get('/api/parseArtist', (req, res) => {
  const {id, page} = req.query;
  const pagePart = page ? `/page/${page}` : '';
  request.get(`https://colorcodedlyrics.com/${encodeURI(id)}${pagePart}`, (_, __, text) => {
    const $ = cheerio.load(text);
    const items = Array.from($('.entry-title a')).map((a) => {
      const url = a.attribs.href;
      const parts = url.split('/');
      const id = parts[parts.length - 1];
      const name = $(a).text();
      const img = $(a.parent.parent.parent).find('img')[0];
      let imgSrc = null;
      if (img) {
        imgSrc = img.attribs.src;
      }

      return {name, id, imgSrc};
    });

    res.set({ 'content-type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' })
    res.end(JSON.stringify(items));
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("../build"));
  app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api/')) return next();
    res.sendFile(path.join(__dirname + '/../build/index.html'));
  });
}

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
