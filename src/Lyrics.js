import React, { Component } from 'react';
import autobind from 'react-autobind';

import ToggleButton, { ToggleButtonGroup } from '@material-ui/lab/ToggleButton';

import './Lyrics.css';

class Lyrics extends Component {
  constructor() {
    super();
    this.state = {
      videoId: null,
      lyrics: null,
      formats: ['kr', 'tr'],
    };

    autobind(this);
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

  handleDisplay(formats) {
    if (formats && formats.length)
      this.setState({formats});
  }

  render() {
    if (this.state.videoId)
      this.props.onVideoChange(this.state.videoId);

    const {formats, lyrics} = this.state;

    const mapping = {
      Korean: 'kr',
      Romanization: 'rm',
      Translation: 'tr',
    };

    const buttons = [
      { id: 'rm', icon: 'rm', label: 'Roman', ext: 'ization' },
      { id: 'kr', icon: '한', label: 'Kor', ext: 'ean' },
      { id: 'tr', icon: 'tr', label: 'Tran', ext: 'slation' },
    ];

    return (
        <div className="Lyrics">
          <ToggleButtonGroup value={formats} onChange={this.handleDisplay} className="Lyrics--togglebar">
            {buttons.map(({id, icon, label, ext}) =>
                         <ToggleButton value={id}>
                             <span className="txt-icon">{icon}</span> {label}<span className="ext">{ext}</span>
                           </ToggleButton>
            )}
          </ToggleButtonGroup>
          <div className="Lyrics--content">{
              Object.keys(lyrics || {}).filter(x => formats.includes(mapping[x])).map(
                key => <div dangerouslySetInnerHTML={{__html: lyrics[key]}}/>
              )
          }</div>
        </div>
    );
  }
}

export default Lyrics;
