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
import PlaceholderImage from './assets/placeholder.png';

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playback: true,
      currentTime: 0,
      duration: 0,
      catchUp: false,
      reseting: false,
    };
    this.yp = React.createRef();
    this.debounceSeek = debounce(this.debounceSeek, 200);
    autobind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.getDerivedStateFromProps(nextProps);
  }

  getDerivedStateFromProps(nextProps) {
    if (nextProps.videoId !== this.props.videoId) {
      this.setState({
        resetting: true,
      },
      () => {
        this.setState({
          currentTime: 0,
          catchUp: true,
          playback: true,
          resetting: false,
        });
      });
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      if (this.yp && this.yp.current && this.yp.current.player) {
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
    if (this.yp && this.yp.current && this.yp.current.player) {
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

    const { resetting, playback } = this.state;
    const { videoId } = this.props;

    const youtubePlayer = (
      <YoutubePlayer
        videoId={videoId}
        playbackState={playback ? 'playing' : 'paused'}
        configuration={
          {
            showinfo: 0,
            controls: 0,
            modestBranding: 1,
            autoplay: 1,
          }
        }
        ref={this.yp}
        />
    );

    const playerEl = videoId && !resetting ? youtubePlayer : <img src={PlaceholderImage} />;

    return (
      <div className="Player">
        <AppBar position="static">
          <Toolbar disableGutters={true} className="Player--toolbar">
            <div className="Player--controls">
              <IconButton aria-label="Play/pause">
                  {
                    playback
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
              {playerEl}
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
