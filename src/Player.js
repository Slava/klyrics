import React, { Component } from 'react';
import autobind from 'react-autobind';
import debounce from 'debounce';

import YoutubePlayer from 'react-youtube-player';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';

import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayCircleIcon from '@material-ui/icons/PlayCircleFilled';
import PauseCircleIcon from '@material-ui/icons/PauseCircleFilled';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import IconButton from '@material-ui/core/IconButton';
import Slider from '@material-ui/lab/Slider';

import './Player.css';

class Player extends Component {
  constructor() {
    super();
    this.state = {
      playback: true,
      currentTime: 0,
      duration: 0,
      catchUp: false,
    };
    this.yp = React.createRef();
    this.debounceSeek = debounce(this.debounceSeek, 200);
    autobind(this);
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      if (this.yp && this.yp.current.player) {
        this.yp.current.player.getCurrentTime().then(currentTime => {
          if (currentTime) {
            if (this.state.catchUp) {
              if (Math.abs(currentTime - this.state.currentTime) < 0.5) {
                this.setState({currentTime, catchUp: false});
              }
            } else {
              this.setState({currentTime});
            }
          }
        });
        this.yp.current.player.getDuration().then(duration => {
          if (duration)
            this.setState({duration});
        });
      }
    }, 500);
  }

  componentWillUnmount() {
    if (this.interval)
      clearInterval(this.interval);
  }

  debounceSeek(t) {
    this.yp.current.player.seekTo(t, true);
  }

  handleSliderChange(event, value) {
    const t = (value / 100.0) * this.state.duration;
    if (this.yp && this.yp.current.player) {
      this.setState({ currentTime: t, catchUp: true });
      this.yp.current.player.seekTo(t, false);
      this.debounceSeek(t);
    }
  }

  render() {
    const playPause = () => {
      this.setState({
        playback: !this.state.playback,
      });
    };

    const { currentTime, duration } = this.state;

    const current = formatTime(currentTime);
    const totalDuration = formatTime(duration);
    const progressValue = currentTime / duration * 100;

    return (
      <div className="Player">
        <AppBar position="static">
          <Toolbar disableGutters={true}>
            <div className="Player--controls">
                <IconButton aria-label="Play/pause">
                  {
                    this.state.playback
                      ? <PauseCircleIcon onClick={playPause} />
                      : <PlayCircleIcon onClick={playPause} />
                  }
                </IconButton>
                <div className="stamps">
                  <span className="time-stamp">{current}</span>
                </div>
                <Slider className="progress-bar" value={progressValue} onChange={this.handleSliderChange} />
                <div className="stamps end">
                  <span className="time-stamp">{totalDuration}</span>
                </div>
            </div>
            <div className="Player--iframe-container">
              <YoutubePlayer
                videoId='QqkT2q9x5rw'
                playbackState={this.state.playback ? 'playing' : 'paused'}
                configuration={
                  {
                    showinfo: 0,
                    controls: 0,
                    modestBranding: 1
                  }
                }
                ref={this.yp}
                />
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

function formatTime(t) {
  t = Math.floor(t);
  const mins = Math.floor(t / 60);
  const secs = Math.floor(t - mins * 60);
  return mins + ':' + (secs < 10 ? "0" + secs : secs);
}

export default Player;
