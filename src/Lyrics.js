import React, { Component } from 'react';

import './Lyrics.css';

class Lyrics extends Component {
  constructor() {
    super();
    this.state = {
      videoId: null,
      lyrics: null,
    };
  }

  refetch(props) {
    if (!props.tag)
      return;
    fetch('//localhost:8000/parse?id=' + encodeURI(props.tag))
      .then(res => res.json())
      .then(json => this.setState(json));
  }

  componentDidMount() {
    this.refetch(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.tag !== nextProps.tag)
      this.refetch(nextProps);
  }

  render() {
    if (this.state.videoId)
      this.props.onVideoChange(this.state.videoId);

    return (
        <div className="Lyrics">
        {
          Object.values(this.state.lyrics || {}).map(
            text => <div dangerouslySetInnerHTML={{__html: text}}/>
          )
        }
        </div>
    );
  }
}

export default Lyrics;
