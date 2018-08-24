import React, { Component } from 'react';
import { Link } from 'simple-react-router';
import Autosuggest from 'react-autosuggest';
import autobind from 'react-autobind';
import debounce from 'debounce';

import './Toolbar.css';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import SearchIcon from '@material-ui/icons/Search';
import TrendingUpIcon from '@material-ui/icons/InsertChartOutlined';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';


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
    fetch('/api/search?q=' + value)
      .then(res => res.json())
      .then(json => {
        if (this.state.searchVersion === version)
          this.setState({ suggestions: json })
      });
  }

  renderInputComponent(inputProps) {
    const { inputRef = () => {}, ref, InputProps, ...other } = inputProps;

    return (
      <TextField
        fullWidth
        InputProps={{
          inputRef: node => {
            ref(node);
            inputRef(node);
          },
          className: "react-autosuggest__input",
          ...InputProps
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
      suggestions: [],
    });

    this.setState({
      value: '',
    });
  }

  onSelected(event, {suggestion}) {
    const tag = suggestion[1];
    this.props.onSelected(tag);
  }

  render() {
    const inputProps = {
      placeholder: 'Search...',
      value: this.state.value,
      onChange: this.onChange,
      InputProps: {
        startAdornment: <InputAdornment position="start"><SearchIcon className="search-icon"/></InputAdornment>,
      },
    };

    return (
        <div className="Toolbar">
          <AppBar position="static">
            <Toolbar className="Toolbar--toolbar">
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
              <IconButton href="/" component={Link}>
                <TrendingUpIcon className="trending-icon"/>
              </IconButton>
            </Toolbar>
          </AppBar>
        </div>
    );
  }
}

export default ToolbarComp;
