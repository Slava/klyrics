import React, { Component } from 'react';
import autobind from 'react-autobind';

import Player from './Player';
import Toolbar from './Toolbar';

export default class extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  onSelected(tag) {
    this.props.router.redirectTo(`/${tag}`);
  }

  render() {
    return (
      <div className="App">
        <Toolbar onSelected={this.onSelected}/>
        <div>Home page</div>
        <Player videoId=""/>
      </div>
    );
  }
}
