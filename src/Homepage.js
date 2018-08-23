import React from 'react';
import { Link } from 'simple-react-router';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

import './Homepage.css';

export default function () {
  const popularSongs = [
    { id: 'bts-bangtansonyeondan-fake-love', name: 'BTS (방탄소년단) - Fake Love', imgSrc: 'https://i0.wp.com/colorcodedlyrics.com/wp-content/uploads/2018/05/BTS-FAKE-LOVE.jpg?resize=200%2C200&ssl=1' },
    { id: "red-velvet-bad-boy", name: 'Red Velvet - Bad Boy', imgSrc: "https://i2.wp.com/colorcodedlyrics.com/wp-content/uploads/2018/01/RED.jpg?resize=200%2C200&ssl=1"},
    { id: 'momoland-bboom-bboom-bbumbbum', name: 'MOMOLAND - BBoom BBoom (뿜뿜)', imgSrc: "https://i1.wp.com/colorcodedlyrics.com/wp-content/uploads/2018/01/2298284-1.jpg?resize=200%2C200&ssl=1" },
    { id: 'ikon-love-scenario-salangeul-haessda', name: 'iKON - LOVE SCENARIO (사랑을 했다)', imgSrc: "https://i0.wp.com/colorcodedlyrics.com/wp-content/uploads/2018/01/iKON-Return.jpg?resize=200%2C200&ssl=1" },
    { id: 'twice-what-is-love', name: 'TWICE - What Is Love?', imgSrc: "https://i2.wp.com/colorcodedlyrics.com/wp-content/uploads/2018/04/twice.jpg?resize=200%2C200&ssl=1" },
    {"id":"j-hope-jeihob-daydream-baegilmong","name":"J-Hope (제이홉) - Daydream (백일몽)","imgSrc":"https://i2.wp.com/colorcodedlyrics.com/wp-content/uploads/2018/03/J-Hope-Hope-World.jpg?resize=200%2C200&ssl=1"},
    {"id":"j-hope-jeihob-airplane","name":"J-Hope (제이홉) - Airplane","imgSrc":"https://i2.wp.com/colorcodedlyrics.com/wp-content/uploads/2018/03/J-Hope-Hope-World.jpg?resize=200%2C200&ssl=1"},
    {"id":"got7-look","name":"GOT7 - Look","imgSrc":"https://i2.wp.com/colorcodedlyrics.com/wp-content/uploads/2018/03/GOT7-–-Eyes-On-You-.jpg?resize=200%2C200&ssl=1"},
    {"id":"blackpink-ddu-du-ddu-du","name":"BLACKPINK - DDU-DU DDU-DU (뚜두뚜두)","imgSrc":"https://i1.wp.com/colorcodedlyrics.com/wp-content/uploads/2018/06/BLACKPINK-SQUARE-UP.jpg?resize=200%2C200&ssl=1"},
    {"id":"jonghyun-jonghyeon-shinin-bichi-na","name":"Jonghyun (종현) - Shinin’ (빛이 나)","imgSrc":"https://i2.wp.com/colorcodedlyrics.com/wp-content/uploads/2018/01/Jonghyun-Poet-Artist.jpg?resize=200%2C200&ssl=1"},
    {"id":"pentagon-shine-bichnali","name":"PENTAGON - Shine (빛나리)","imgSrc":"https://i1.wp.com/colorcodedlyrics.com/wp-content/uploads/2018/04/PENTAGON-Positive.jpg?resize=200%2C200&ssl=1"},
    {"id":"bts-bangtansonyeondan-intro-euphoria","name":"BTS (방탄소년단) - Euphoria","imgSrc":"https://i0.wp.com/colorcodedlyrics.com/wp-content/uploads/2018/05/BTS-FAKE-LOVE.jpg?resize=200%2C200&ssl=1"},
    {"id":"seventeen-thanks-gomabda","name":"SEVENTEEN - THANKS (고맙다)","imgSrc":"https://i2.wp.com/colorcodedlyrics.com/wp-content/uploads/2018/02/SEVENTEEN-DIRECTORS-CUT.jpg?resize=200%2C200&ssl=1"},
    {"id":"bts-bangtansonyeondan-intro-singularity","name":"BTS (방탄소년단) - Intro: Singularity","imgSrc":"https://i0.wp.com/colorcodedlyrics.com/wp-content/uploads/2018/05/BTS-FAKE-LOVE.jpg?resize=200%2C200&ssl=1"},
    {"id":"exo-cbx-chenbaegsi-blooming-day-yoil","name":"EXO-CBX (첸백시) - Blooming Day (花요일)","imgSrc":"https://i2.wp.com/colorcodedlyrics.com/wp-content/uploads/2018/04/EXO-CBX-Blooming-Days.jpg?resize=200%2C200&ssl=1"},
    {"id":"bts-bangtansonyeondan-anpanman","name":"BTS (방탄소년단) - Anpanman","imgSrc":"https://i0.wp.com/colorcodedlyrics.com/wp-content/uploads/2018/05/BTS-FAKE-LOVE.jpg?resize=200%2C200&ssl=1"},
    {"id":"sunmi-seonmi-heroine-juingong","name":"Sunmi (선미) - Heroine (주인공)","imgSrc":"https://i1.wp.com/colorcodedlyrics.com/wp-content/uploads/2018/01/Sunmi-Heroine.jpg?resize=200%2C200&ssl=1"},
  ];
  return (
    <div className="Homepage">
      <Typography variant="title">Popular songs:</Typography>
      <List className="Homepage--song-list song-list">{popularSongs.map(
          song => <ListItem href={"/" + song.id} button id={song.id} divider={true} component={Link}>
            <Avatar src={song.imgSrc} className="song-cover"/>
              {song.name}
              <OpenInNewIcon fontSize="inherit" className="open-new-icon"/>
        </ListItem>)}
    </List>
      <Typography variant="caption">Translation data from Colorcodedlyrics.com</Typography>
    </div>
  );
}
