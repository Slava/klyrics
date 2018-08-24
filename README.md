# Klyrics

A Kpop music player, served with Korean and English lyrics.

The original frustration stemmed from my personal frustration browsing lyrics on my phone, while listening to music. Any website I could find serving Korean lyrics either didn't have a quality translation, or would display it poorly, or would just look horribly unusable on mobile.

I worked on Klyrics as part of my week-long participation in Hack Lodge.

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

