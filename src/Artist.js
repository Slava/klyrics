import React, { Component } from 'react';
import { Link } from 'simple-react-router';
import autobind from 'react-autobind';

import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

import './Artist.css';

class Artist extends Component {
  constructor() {
    super();

    this.state = {
      songs: null,
      nextPage: 2,
      fetching: false,
    };

    autobind(this);
  }

  fetchMore() {
    const { nextPage, songs } = this.state;
    const { tag } = this.props;

    this.setState({ fetching: true }, () => {
      fetch('//localhost:8000/parseArtist?id=' + encodeURI(tag) + '&page=' + nextPage)
        .then(res => res.json())
        .then(json => {
          this.setState({
            songs: songs.concat(json),
            nextPage: json.length ? nextPage + 1 : -1,
            fetching: false
          });
        });
    });
  }

  refetch(props) {
    if (!props.tag)
      return;

    fetch('//localhost:8000/parseArtist?id=' + encodeURI(props.tag))
      .then(res => res.json())
      .then(json => this.setState({ songs: json, nextPage: 2 }));
  }

  componentDidMount() {
    this.refetch(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.tag !== nextProps.tag)
      this.refetch(nextProps);
  }

  render() {
    const {songs, fetching, nextPage} = this.state;
    if (!songs) return <div>Loading</div>;

    const processed = songs.filter(song => song[1].indexOf('lyrics-index') === -1).map(song => {
      const matched = song[0].match(/(.*)–(.*)/);
      if (matched) {
        return [matched[2].trim(), song[1]];
      }
      return song;
    });

    let name;
    let subname;
    try {
      name = songs[songs.length - 1][0].split(/–/)[0];
      name = songs[0][0].replace(/Lyrics Index/g, '').trim();

      const match = name.match(/(.*)\((.*)\)/);
      if (match) {
        name = match[1];
        subname = match[2];
      }
    } catch (err) {
    }

    const moreButton = nextPage === -1 ? null :
          <Button disabled={fetching} onClick={this.fetchMore} variant="contained" className="load-more-button">More</Button>;

    return (
        <div className="Artist">
          <div className="Artist--header">
            <Typography className="Artist--title" variant="display1" align="center">{name}</Typography>
            <Typography className="Artist--subtitle" variant="subheading" align="center">{subname}</Typography>
            <Divider/>
          </div>
          <List className="Artist--song-list">{processed.map(
              song => <ListItem button id={song[1]}>
                        <Link href={"/" + song[1]}>
                          {song[0]}
                          <OpenInNewIcon fontSize="inherit" className="open-new-icon"/></Link>
                      </ListItem>)}
          </List>
        <div className="load-more-container">
          {moreButton}
        </div>
        </div>
    );
  }
}

export default Artist;
