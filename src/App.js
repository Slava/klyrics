import React, { Component } from 'react';
import autobind from 'react-autobind';

import Headroom from 'react-headroom';

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

  getWrapper() {
    return this.wrapperRef && this.wrapperRef.current;
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
      <div className="App-wrapper">
        <Headroom ><Toolbar onSelected={this.onSelected}/></Headroom>
        <div className="App">
          <Lyrics tag={tag} onVideoChange={this.onVideoChange}/>
          <Player videoId={this.state.videoId}/>
        </div>
      </div>
    );
  }
}

export default App;
