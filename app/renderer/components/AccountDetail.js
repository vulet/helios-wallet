import React, { Component } from 'react';
import { Client } from '@helium/http';

class AccountDetail extends Component {
  state = {
    balance: 0,
  }

  async componentDidMount() {
    if (this.unmounted) return;
    await this.checkBalance();
  }

    checkBalance = async () => {
      const client = new Client();
      const { account } = this.props;
      const currentAccount = await client.accounts.get(account.address);
      const balance = currentAccount.balance.floatBalance;
      this.setState((state) => ({ balance }));
    };

    render() {
      const { textClass, account } = this.props;
      const { balance } = this.state;
      return (
        <>
          <div className={`${textClass} font-bold`}>{account.address}</div>
          <div className="card">
            {!balance ? (
              <div className={`${textClass} font-semibold`}>{`Loading your balance...`}</div>
            ) : (
              <>
                <div className={`${textClass} font-semibold`}>{`Balance: ${balance} HNT`}</div>
              </>
            )}
          </div>
        </>
      );
    }
}
export default AccountDetail;
