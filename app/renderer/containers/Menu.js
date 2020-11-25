import React, { Component } from 'react';
import {
  AccountDetail,
  Button,
  CreateTransaction,
  PendingTxn,
  ShowTransactions,
} from '../components/index';

class Menu extends Component {
  state = {
    showComponent: null,
    showTransactions: null,
  };

  createTxn = () => {
    this.setState((state) => ({
      showComponent: !state.showComponent,
      showTransactions: false,
    }));
  };

  showTxn = () => {
    this.setState((state) => ({
      showTransactions: !state.showTransactions,
      showComponent: false,
    }));
  };

  render() {
    const {
      account,
      transport,
      textClass,
    } = this.props;
    const {
      showTransactions,
      showComponent,
    } = this.state;

    return (
      <div className="card">
        { localStorage.getItem('pending') ? <PendingTxn account={account} textClass={textClass} /> : <AccountDetail account={account} textClass={textClass} /> }
        <div className="flex">
          <Button
            text="Create Transaction"
            onClick={this.createTxn}
          />
          <div className="p-1" />
          <Button
            text="History"
            onClick={this.showTxn}
          />
        </div>
        <br />
        { showTransactions && <ShowTransactions account={account} textClass={textClass} /> }
        { showComponent && <CreateTransaction transport={transport} account={account} closeTxn={this.createTxn} /> }
      </div>
    );
  }
}

export default Menu;
