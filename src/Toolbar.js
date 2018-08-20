import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import autobind from 'react-autobind';

import './Toolbar.css';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';


class ToolbarComp extends Component {
  constructor() {
    super();

    this.state = {
      suggestions: [],
      value: '',
    };

    this.popperNode = null;

    autobind(this);
  }

  onChange(event, {newValue}) {
    this.setState({
      value: newValue,
    });
  }

  onSuggestionsFetchRequested({ value }) {
    fetch('//localhost:8000/search?q=' + value)
      .then(res => res.json())
      .then(json => {
        this.setState({ suggestions: json })
      });
  }

  renderInputComponent(inputProps) {
    const { inputRef = () => {}, ref, ...other } = inputProps;

    return (
      <TextField
        fullWidth
        InputProps={{
          inputRef: node => {
            ref(node);
            inputRef(node);
            this.popperNode = node.parentElement;
          },
          className: "react-autosuggest__input"
        }}
        {...other}
        />
    );
  }

  renderSuggestion(suggestion) {
    return (
      <span>
        <span>{suggestion[0]}</span>
      </span>
    );
  }

  renderSuggestionsContainer(options) {
    return (
      <Popper anchorEl={this.popperNode} open={Boolean(options.children)} placement="bottom">
        <Paper square {...options.containerProps} style={{ width: this.popperNode ? this.popperNode.clientWidth : null }} >
          {options.children}
        </Paper>
      </Popper>
    );
  }

  onClear() {
    // do not clear on things like click away
    return;
    this.setState({
      value: '',
    });
  }

  onSelected(event, {suggestion}) {
    const [name, tag] = suggestion;
    this.props.onSelected(tag);
  }

  render() {
    const inputProps = {
      placeholder: 'Search...',
      value: this.state.value,
      onChange: this.onChange
    };

    return (
        <div className="Toolbar">
          <AppBar position="static">
            <Toolbar>
              <SearchIcon className="search-icon"/>
              <Autosuggest
                suggestions={this.state.suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onClear}
                onSuggestionSelected={this.onSelected}
                getSuggestionValue={(suggestion) => suggestion[0]}
                renderSuggestion={this.renderSuggestion}
                inputProps={inputProps}
                renderInputComponent={this.renderInputComponent}
                />
              <IconButton className="close-icon-button">
                <CloseIcon className="close-icon"/>
              </IconButton>
            </Toolbar>
          </AppBar>
        </div>
    );
  }
}

export default ToolbarComp;
