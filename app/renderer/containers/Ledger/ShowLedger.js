import React, { Component } from 'react';
import { Client } from '@helium/http';
import { HNT } from 'helios-transport';
import { Button } from '../../components/index';
import Menu from '../Menu';

const delay = (ms) => new Promise((success) => setTimeout(success, ms));
const client = new Client();

class ShowLedger extends Component {
    state = {
      account: null,
    };

    async componentDidMount() {
      while (!this.state.account) {
        if (this.unmounted) return;
        await this.openLedger();
        await delay(500);
      }
    }

    async componentWillUnmount() {
      this.unmounted = true;
    }

  openLedger = async () => {
    const { transport } = this.props;
    const hnt = new HNT(transport);
    const ledger = await hnt.getPublicKey(false)
      .catch((error) => (this.setState({ error })));
    const { error } = this.state;
    if (error) return;
    const account = await client.accounts.get(ledger.b58);
    this.setState({ account, transport });
  };

  render() {
    const {
      account,
      error,
      history,
      transport,
    } = this.state;
    const { textClass } = this.props;
    let loading = textClass;
    if (error) loading = 'hidden';
    return (
      <div>
        {!account ? (
          <>
            <p className={loading}>Loading your Helium address...</p>
            {error ? (
              <>
                <p className="error">
                  An error has occurred, make sure the Helium application
                  is open on your Ledger Nano S/X.
                  <br />
                  {String((error && error.message) || error)}
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
          <Menu account={account} transport={transport} history={history} textClass={textClass} />
        )}
      </div>
    );
  }
}

export default ShowLedger;
