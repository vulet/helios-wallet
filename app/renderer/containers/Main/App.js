import React, { Component } from 'react';
import ImportLedger from '../Ledger/ImportLedger';
import ShowLedger from '../Ledger/ShowLedger';

class App extends Component {
  state = {
    transport: null,
  };

  onSelectDevice = async(transport) => {
    window.ledgerTransport = transport;
    transport.on('disconnect', () => {
      this.setState({ transport: null });
    });
    this.setState({ transport });
  };


  render() {
    const { transport } = this.state;
    const textClass = 'block text-gray-700 text-large font-bold pb-1';
    return (
      <div className="App">
        {!transport ? (
          <ImportLedger onSelectDevice={this.onSelectDevice} textClass={textClass} />
        ) : (
          <ShowLedger transport={transport} textClass={textClass} />
        )}
      </div>
    );
  }
}

export default App;
