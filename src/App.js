import React, { Component } from 'react';
import autobind from 'react-autobind';

import Player from './Player';
import Toolbar from './Toolbar';
import Lyrics from './Lyrics';

import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      videoId: null,
    };

    autobind(this);
  }

  onSelected(tag) {
    this.props.router.redirectTo(`/${tag}`);
  }

  onVideoChange(videoId) {
    if (videoId === this.state.videoId)
      return;

    this.setState({
      videoId,
    });
  }

  render() {
    const tag = this.props.location.params.path;
    return (
      <div className="App">
        <Toolbar onSelected={this.onSelected}/>
        <Lyrics tag={tag} onVideoChange={this.onVideoChange}/>
        <Player videoId={this.state.videoId}/>
      </div>
    );
  }
}

export default App;
