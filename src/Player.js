import React, { Component } from 'react';
import YoutubePlayer from 'react-youtube-player';

import './Player.css';

class Player extends Component {
  constructor() {
    super();
    this.state = {
      playback: true,
    };
  }
  render() {
    const playPause = () => {
      this.setState({
        playback: !this.state.playback,
      });
    };

    return (
        <div className="Player">
          <div className="Player--controls">
            <button onClick={playPause}>Play</button>
          </div>
          <div className="Player--iframe-container">
            <YoutubePlayer
              videoId='QqkT2q9x5rw'
              playbackState={this.state.playback ? 'playing' : 'paused'}
              configuration={
                {
                  showinfo: 0,
                  controls: 0
                }
              }
              />
          </div>
        </div>
    );
  }
}

export default Player;
