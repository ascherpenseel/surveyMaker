import React from 'react';
import './styles/App.scss';

class App extends React.Component {
  
  constructor (props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  callAPI () {
    fetch("http://localhost:9000/testAPI")
      .then(res => res.text())
      .then(res => this.setState({ apiResponse: res }));
  }

  componentDidMount () {
    const { id } = this.props.match.params;
    console.log(id);
    // this.callAPI();
  }

  render () {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <p className="App-intro">{this.state.apiResponse}</p>
      </div>
    );
  }
}

export default App;
