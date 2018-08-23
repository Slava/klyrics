import React, { Component } from 'react';
import { Link } from 'simple-react-router';
import autobind from 'react-autobind';

import './Artist.css';

class Artist extends Component {
  constructor() {
    super();

    this.state = {
      songs: null,
    };

    autobind(this);
  }

  refetch(props) {
    if (!props.tag)
      return;
    fetch('//localhost:8000/parseArtist?id=' + encodeURI(props.tag))
      .then(res => res.json())
      .then(json => this.setState({ songs: json }));
  }

  componentDidMount() {
    this.refetch(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.tag !== nextProps.tag)
      this.refetch(nextProps);
  }

  render() {
    const {songs} = this.state;
    return (
        <div className="Artist">
          <ul>{(songs || []).map(
            song => <li id={song[1]}><Link href={"/" + song[1]}>{song[0]}</Link></li>)}</ul>
        </div>
    );
  }
}

export default Artist;
