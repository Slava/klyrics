import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import autobind from 'react-autobind';
import debounce from 'debounce';

import './Toolbar.css';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';


class ToolbarComp extends Component {
  constructor() {
    super();

    this.state = {
      suggestions: [],
      value: '',
      searchVersion: 0,
    };

    autobind(this);
    this.onSuggestionsFetchRequested = debounce(this.onSuggestionsFetchRequested, 150);
  }

  onChange(event, {newValue}) {
    this.setState({
      value: newValue,
    });
  }

  onSuggestionsFetchRequested({ value }) {
    const version = this.state.searchVersion;
    fetch('//localhost:8000/search?q=' + value)
      .then(res => res.json())
      .then(json => {
        if (this.state.searchVersion === version)
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

  onClear() {
    this.setState({
      searchVersion: this.state.searchVersion + 1,
    });

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
