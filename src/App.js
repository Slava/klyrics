import React, { Component } from 'react';
import autobind from 'react-autobind';

import Headroom from 'react-headroom';

import Player from './Player';
import Toolbar from './Toolbar';
import Lyrics from './Lyrics';
import Artist from './Artist';
import Homepage from './Homepage';

import {APP} from './constants';

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
    const {location} = this.props;
    const {path, type} = location.params;

    const getBody = (type) => {
      switch (type) {
      case APP.LYRICS:
        return <Lyrics tag={path} onVideoChange={this.onVideoChange}/>;
      case APP.ARTIST:
        return <Artist tag={path}/>;
      case APP.HOMEPAGE:
        return <Homepage/>;
      default:
        console.error('no matching app route');
        return null;
      }
    };

    return (
      <div className="App-wrapper">
        <Headroom ><Toolbar onSelected={this.onSelected}/></Headroom>
        <div className="App">
          <Player videoId={this.state.videoId}/>
          {getBody(type)}
        </div>
      </div>
    );
  }
}

export default App;
