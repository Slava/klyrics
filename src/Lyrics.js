import React, { Component } from 'react';


import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import FormatColorFillIcon from '@material-ui/icons/FormatColorFill';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ToggleButton, { ToggleButtonGroup } from '@material-ui/lab/ToggleButton';

import './Lyrics.css';

class Lyrics extends Component {
  constructor() {
    super();
    this.state = {
      videoId: null,
      lyrics: null,
    };
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

  render() {
    if (this.state.videoId)
      this.props.onVideoChange(this.state.videoId);

    return (
        <div className="Lyrics">
          <Grid item xs={12} sm={6}>
            <div>
              <ToggleButtonGroup value={['bold']} onChange={this.handleFormat}>
                <ToggleButton value="bold">
                  <FormatBoldIcon />
                </ToggleButton>
                <ToggleButton value="italic">
                  <FormatItalicIcon />
                </ToggleButton>
                <ToggleButton value="underlined">
                  <FormatUnderlinedIcon />
                </ToggleButton>
                <ToggleButton disabled value="color">
                  <FormatColorFillIcon />
                  <ArrowDropDownIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
            <Typography type="caption" gutterBottom>
              Multiple Selection
            </Typography>
            <Typography type="caption">
              Logically-grouped options, like Bold, Italic, and Underline, allow multiple options to
              be selected.
            </Typography>
          </Grid>
          <div className="Lyrics--content">{
              Object.values(this.state.lyrics || {}).map(
                text => <div dangerouslySetInnerHTML={{__html: text}}/>
              )
          }</div>
        </div>
    );
  }
}

export default Lyrics;
