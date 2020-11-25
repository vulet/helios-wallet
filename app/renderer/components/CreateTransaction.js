import React, { Component } from 'react';
import { Address } from '@helium/crypto';
import { PaymentV1, Transaction } from '@helium/transactions';
import { Client } from '@helium/http';
import axios from 'axios';
import { HNT } from 'helios-transport';
import Button from './Button';

class CreateTransaction extends Component {
  state = {
    transport: null,
    error: null,
    recipient: '',
    amount: '',
  };

  onChange = (event) => this.setState({ [event.target.name]: event.target.value });

  async createTransaction() {
    try {
      const { transport, account, closeTxn } = this.props;
      const { recipient, amount } = this.state;
      const hnt = new HNT(transport);
      const client = new Client();
      const vars = await client.vars.get();
      Transaction.config(vars);
      const transaction = new PaymentV1({
        payer: Address.fromB58(account.address),
        payee: Address.fromB58(recipient),
        amount: (Number(amount) * 100000000).toFixed(),
        nonce: (Number(account.nonce) + 1).toFixed(),
      });
      const sign = await hnt.signTransaction(transaction);
      transaction.signature = sign.signature;
      await axios.post('http://api.helium.io/v1/pending_transactions/',
        { txn: transaction.toString() }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        .then((response) => {
          localStorage.setItem('pending', response.data.data.hash);
          closeTxn();
        });
    } catch (error) {
      if (this.unmounted) return;
      this.setState({ error });
    }
  }

  render() {
    const {
      amount,
      error,
      recipient,
      transport,
    } = this.state;
    const titleClass = 'block text-gray-700  font-bold mb-2';
    const inputClass = 'shadow appearance-none border rounded  w-full py-2 px-2  text-grey-darker leading-tight focus:outline-none';
    return (
      <>
        {error
          ? (
            <p className="error">
              {`Invalid transaction: ${String((error && error.message) || error)}`}
            </p>
          ) : (
            <>
              <div className="mb-4">
                <strong className={titleClass}>Recipient</strong>
                <div className="relative">
                  <input
                    name="recipient"
                    value={recipient}
                    onChange={this.onChange}
                    className={inputClass}
                    type="text"
                    spellCheck="false"
                  />
                </div>
              </div>
              <div className="mb-6">
                <strong className={titleClass}>Amount</strong>
                <div className="inline-block relative">
                  <input
                    name="amount"
                    value={amount}
                    onChange={this.onChange}
                    className={inputClass}
                    type="number"
                  />
                </div>
              </div>
              <Button
                transport={transport}
                onClick={this.createTransaction.bind(this)}
                text="Submit"
              />
            </>
          )}
      </>
    );
  }
}

export default CreateTransaction;
