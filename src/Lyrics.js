import React, { Component } from 'react';
import autobind from 'react-autobind';

import ToggleButton, { ToggleButtonGroup } from '@material-ui/lab/ToggleButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormatSizeIcon from '@material-ui/icons/FormatSize';

import './Lyrics.css';

const colors = [
  '#212121',
  '#b71c1c',
  '#1a237e',
  '#004d40',
  '#f57f17',
  '#01579b',
  '#880e4f',
  '#4a148c',
  '#e65100',
  '#4E342E'
];

function renderParagraph(paragraph, i) {
  if (!paragraph)
    return null;
  return (
    <p id={i}>{
        paragraph.map((x, i) => x.newline ? <br/> : <span style={{color: colors[x.styleId]}}>{x.line}</span>)
    }</p>
  );
}

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
    const {formats, lyrics, author, name, videoId} = this.state;

    if (videoId)
      this.props.onVideoChange(videoId);

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

    const fontSizeClass = formats.includes('text-size') ? 'large' : 'small';
    const lyricKeys = Object.keys(lyrics || {}).filter(x => formats.includes(mapping[x]));
    let nRows = 0;
    lyricKeys.forEach(key => nRows = Math.max(nRows, lyrics[key].length));
    const tableRows = Array.from(new Array(nRows)).map((_, i) => <tr>{lyricKeys.map(key => <td key={key}>{renderParagraph(lyrics[key][i], i)}</td>)}</tr>);

    return (
      <div className="Lyrics">
        <div className="Lyrics--header">
          <Typography variant="display1" align="center">{name}</Typography>
          <Typography variant="caption" gutterBottom align="center">{author}</Typography>
        </div>
        <Paper>
          <ToggleButtonGroup value={formats} onChange={this.handleDisplay} className="Lyrics--togglebar">
            {buttons.map(({id, icon, label, ext}) =>
                         <ToggleButton value={id}>
                             <span className="txt-icon">{icon}</span> {label}<span className="ext">{ext}</span>
                           </ToggleButton>
                        )}
            <ToggleButton value="text-size" className="format-size-button" onChange={this.handleDisplay}>
              <FormatSizeIcon/>
            </ToggleButton>
          </ToggleButtonGroup>
          <div className={'Lyrics--content ' + fontSizeClass}>
            <table>{tableRows}</table>
          </div>
        </Paper>
      </div>
    );
  }
}

export default Lyrics;
