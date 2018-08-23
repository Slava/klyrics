import React, { Component } from 'react';
import { Link } from 'simple-react-router';
import autobind from 'react-autobind';

import Loading from './Loading';

import ToggleButton, { ToggleButtonGroup } from '@material-ui/lab/ToggleButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormatSizeIcon from '@material-ui/icons/FormatSize';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

import './Lyrics.css';

const SETTINGS_KEY = 'LYRICS_SAVED_SETTINGS';

function saveSettings(settings) {
  window.localStorage && window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function restoreSettings() {
  const saved = window.localStorage && window.localStorage.getItem(SETTINGS_KEY);
  return saved ? JSON.parse(saved) : null;
}

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
        paragraph.map(
          (x, i) => x.newline
            ? <br key={i}/>
            : <span key={i} style={{color: colors[x.styleId]}}>{x.line}</span>
        )
    }</p>
  );
}

class Lyrics extends Component {
  constructor() {
    super();
    this.state = {
      videoId: null,
      lyrics: null,
      formats: restoreSettings() || ['kr', 'tr', 'text-size'],
      fetching: false,
    };

    autobind(this);
  }

  refetch(props) {
    if (!props.tag)
      return;
    this.setState({fetching: true}, () => {
      fetch('/api/parse?id=' + encodeURI(props.tag))
        .then(res => res.json())
        .then(json => this.setState(Object.assign({fetching: false}, json)));
    });
  }

  componentDidMount() {
    this.refetch(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.tag !== nextProps.tag)
      this.refetch(nextProps);
  }

  handleFormats(formats) {
    if (formats && formats.length) {
      this.setState({formats});
      saveSettings(formats);
    }
  }

  renderSadMessage() {
    return (
      <div className="sad-message">
        <Typography variant="display1">This song is not available T_T</Typography>
      </div>
    );
  }

  render() {
    const {
      formats,
      lyrics,
      artist,
      artistId,
      name,
      videoId,
      imgSrc,
      fetching,
    } = this.state;

    if (fetching) {
      return <Loading/>;
    }

    if (!name) {
      return this.renderSadMessage();
    }

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
    const tableRows = Array.from(new Array(nRows)).map(
      (_, i) => <tr key={i}>{lyricKeys.map(
        key => <td key={key}>{renderParagraph(lyrics[key][i], i)}</td>)}</tr>);

    const tableClass = lyricKeys.length < 3 ? 'compact' : '';

    //console.log(JSON.stringify({id: this.props.tag, name: artist + " - " + name, imgSrc}));

    return (
      <div className="Lyrics">
        <div className="Lyrics--header">
          <img className="album-art" src={imgSrc}/>
          <Typography variant="display1" align="center">{name}</Typography>
          <Link href={'/artist/' + artistId}>
            <Typography variant="caption" gutterBottom align="center">{artist}<OpenInNewIcon fontSize="inherit"/></Typography>
          </Link>
        </div>
        <Paper>
          <ToggleButtonGroup value={formats} onChange={this.handleFormats} className="Lyrics--togglebar">
            {buttons.map(({id, icon, label, ext}) =>
                         <ToggleButton value={id} key={id}>
                             <span className="txt-icon">{icon}</span> {label}<span className="ext">{ext}</span>
                           </ToggleButton>
                        )}
            <ToggleButton value="text-size" className="format-size-button" onChange={this.handleFormats}>
              <FormatSizeIcon/>
            </ToggleButton>
          </ToggleButtonGroup>
          <div className={'Lyrics--content ' + fontSizeClass}>
            <table className={tableClass}><tbody>{tableRows}</tbody></table>
          </div>
        </Paper>
      </div>
    );
  }
}

export default Lyrics;
