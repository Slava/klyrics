# Klyrics

A Kpop music player, served with Korean and English lyrics.

The original motivation stemmed from my personal frustration browsing lyrics on my phone, while listening to music. Any website I could find serving Korean lyrics either didn't have a quality translation, or would display it poorly, or would just look horribly unusable on mobile.

As a result I took on a task of creating an ultimate music player for K-pop lovers: it looks great, has a huge database of songs and can provide you Korean lyrics and translations side by side in a format that's easy to use on mobile.

I worked on Klyrics as part of my week-long participation in Hack Lodge.

## Project structure

There are two parts of the project:

- A front-end React app
- A backend scrapper

The scrapper is a pile of manual DOM traversal which is especially upsetting - the source website has no stable markup structure whatsoever (probably a result of hundreds of people adding slightly different HTML posts to the WordPress instance).

The app, on the other hand, is nice and relatively clean.


## Development


```
yarn install
cd server && yarn install && cd ..
yarn start
```

