import React, { Component } from 'react';
import autobind from 'react-autobind';

import Player from './Player';
import Toolbar from './Toolbar';
import Lyrics from './Lyrics';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      tag: null,
      videoId: null,
    };

    autobind(this);
  }

  onSelected(tag) {
    this.setState({
      tag,
    });
  }

  onVideoChange(videoId) {
    if (videoId === this.state.videoId)
      return;

    this.setState({
      videoId,
    });
  }

  render() {
    return (
      <div className="App">
        <Toolbar onSelected={this.onSelected}/>
        <Lyrics tag={this.state.tag} onVideoChange={this.onVideoChange}/>
        <Player videoId={this.state.videoId}/>
      </div>
    );
  }
}

export default App;
