import React from 'react';
import Header from './components/Header';
import TestTypesContainer from './components/TestTypesContainer';
import SubmitButton from './components/SubmitButton';
import ConsoleResults from './components/ConsoleResults';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends React.Component {
  state = {
    testTypes: [],
    tests: [],
    consoleOutput: [],
  };

  componentDidMount() {
    this.API_Call_GetTestTypes()
      .then(res => this.setState({ testTypes: res.express }))
      .then(() => {
        for (let testType of this.state.testTypes) {
          this.API_Call_GetTests(testType)
            .then(res => this.addToTestState(res.express))
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  }

  /**
   * Tests State methods
   */
  addToTestState = (data) => {
    if (typeof data !== 'object') return;

    const tests = {...this.state.tests};
    Object.keys(data).map(key => {
      tests[data[key].id] = data[key];
      this.setState({tests});
    });
  };
  updateTestsState = (key, updatedTest) => {
    const tests = { ...this.state.tests };
    tests[key] = updatedTest;
    this.setState({ tests });
  };

  /**
   * Console output State methods
   */
  addToConsoleOutputState = (data) => {
    this.setState({
      consoleOutput: [...this.state.consoleOutput, data]
    })
  };
  resetConsoleOutputState = () => {
    this.setState({consoleOutput: []})
  };

  runSelectedTests = () => {
    const selectedTests = Object.values(this.state.tests).filter(test =>
      test.isChecked
    );

    this.resetConsoleOutputState(); // Clear state

    selectedTests.map(test => {
      this.API_Call_RunTest(test).then(res => {
        const output = res.express ? res.express : res.stderr;
        this.addToConsoleOutputState(output);
      });
    });
  };

  /**
   * API Calls
   */
  API_Call_GetTestTypes = async () => {
    const response = await fetch('/api/list/test-types');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };
  API_Call_GetTests = async (testType) => {
    const response = await fetch('/api/list/tests-by-type/' + testType);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };
  API_Call_RunTest = async (test) => {
    const response = await fetch(`/api/run/test/${test.type}/${test.name}`);
    return await response.json();

    // Disable error catching, we need must see error in UI
    //if (response.status !== 200) throw Error(body.message);
  };

  render() {
    return (
      <div className="App">
        <Header title="Wundertools test runner App"/>
        <div className="container-fluid">
          <div className="row">
            <div className="col-6">
              <TestTypesContainer
                testTypes={this.state.testTypes}
                tests={this.state.tests}
                updateState={this.updateTestsState}/>
              <SubmitButton label="Run selected tests" runSelectedTests={this.runSelectedTests}/>
            </div>
            <div className="col-6">
              <ConsoleResults
                title="Console results"
                consoleOutput={this.state.consoleOutput}
                textareaRows="25"/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;