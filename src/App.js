import React, { Component } from 'react';
import './App.css';
import { create } from 'apisauce';

import { MultiSelect } from 'react-selectize';
import 'react-selectize/themes/index.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      libraries: [],
      search: ''
    };
  }

  // define the api
  api = create({
    baseURL: 'http://api.cdnjs.com',
    headers: { Accept: 'application/vnd.github.v3+json' }
  });

  onSearchChange = search => {
    this.setState({ search: search });

    if (search.length > 0) {
      this.req = this.api
        .get(`/libraries?fields=version,homepage&search=${search}`)
        .then(response => {
          console.log('Response Data:', response.data.results);
          this.setState(
            { libraries: response.data.results.slice(1, 50) },
            () => {
              this.refs.select.highlightFirstSelectableOption();
            }
          );
          delete this.req;
        });
    }
  };

  filterOptions = (options, search) => {
    return options;
  };

  uid = item => {
    return item.name;
  };

  makeID = () => {
    var text = '';
    var possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < 100; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  };

  renderOption = item => {
    return (
      <div className="simple-option" style={{ fontSize: 12 }}>
        <div>
          <span style={{ fontWeight: 'bold' }}>{item.name}</span>
          <span>{'@' + item.version}</span>
        </div>
      </div>
    );
  };

  renderValue = item => {
    return (
      <div className="simple-value">
        <span style={{ fontWeight: 'bold' }}>{item.name}</span>
        <span>{'@' + item.version}</span>
      </div>
    );
  };

  renderNoResultsFound = (value, search) => {
    return (
      <div className="no-results-found" style={{ fontSize: 13 }}>
        {typeof this.req === 'undefined' && this.state.search.length === 0
          ? 'type a few characters to kick off remote search'
          : 'No results found'}
      </div>
    );
  };

  render() {
    return (
      <MultiSelect
        placeholder="Select a library"
        ref="select"
        options={this.state.libraries}
        search={this.state.search}
        onSearchChange={this.onSearchChange}
        filterOptions={this.filterOptions}
        uid={this.uid}
        renderOption={this.renderOption}
        renderValue={this.renderValue}
        renderNoResultsFound={this.renderNoResultsFound}
      />
    );
  }
}

export default App;
