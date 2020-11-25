import React, { Component } from 'react';
import TransportBLE from '@ledgerhq/hw-transport-web-ble';
import TransportHID from '@ledgerhq/hw-transport-node-hid';
import { Button } from '../../components/index';

class ImportLedger extends Component {
  state = {
    error: null,
  };

createBLE = async () => {
  const { onSelectDevice } = this.props;
  this.setState({ loading: 'Waiting for Bluetooth pairing...' });
  const transport = await TransportBLE.create()
    .catch((error) => (this.setState({ error })));
  if (transport) onSelectDevice(transport);
};

createUSB = async () => {
  const { onSelectDevice } = this.props;
  this.setState({ loading: 'Waiting for USB connection...' });
  const transport = await TransportHID.create()
    .catch((error) => (this.setState({ error })));
  if (transport) onSelectDevice(transport);
};

render() {
  const { loading, error } = this.state;
  const { textClass } = this.props;
  return (
    <>
    <div>
      {loading ? (
        <>
          <div className={`${textClass} pb-4`}>{ `${String((loading))}`}</div>
          <div className="flex justify-center ">
            <Button
              text="Try again"
              onClick={() => window.location.reload(false)}
            />
          </div>
          {!loading && error ? (
            <>
            <p className="error">
              { `Transport initialization has failed: (${String((error && error.message) || error)})`}
            </p>
              <br />
              <div className="flex justify-center ">
                <Button
                  text="Try again"
                  onClick={() => window.location.reload(false)}
                />
              </div>
            </>
          ) : null}
        </>
      ) : (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className={`${textClass} pb-2`}>
            Import wallet
          </div>
          <div className="flex items-center justify-between">
            <div className="p-4" />
            <Button
              text="Connect with USB"
              onClick={this.createUSB}
            />
            <div className="p-1" />
            <Button
              text="Connect with Bluetooth"
              onClick={this.createBLE}
            />
          </div>
        </div>
      )}
    </div>
    </>
  );
}
}

export default ImportLedger;
