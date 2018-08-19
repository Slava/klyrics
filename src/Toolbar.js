import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import autobind from 'react-autobind';

import './Toolbar.css';

class Toolbar extends Component {
  constructor() {
    super();

    this.state = {
      suggestions: [],
      value: '',
    };

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

  renderSuggestion(suggestion) {
    return (
      <span>
        <span>{suggestion[0]}</span>
      </span>
    );
  }

  onClear() {
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
            <Autosuggest
              suggestions={this.state.suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onClear}
              onSuggestionSelected={this.onSelected}
              getSuggestionValue={(suggestion) => suggestion[0]}
              renderSuggestion={this.renderSuggestion}
              inputProps={inputProps}
              />
        </div>
    );
  }
}

export default Toolbar;
