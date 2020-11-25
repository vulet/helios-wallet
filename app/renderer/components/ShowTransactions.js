import React, { Component } from 'react';

class ShowTransactions extends Component {
    state = {
      history: null,
    }

    async componentDidMount() {
      if (this.unmounted) return;
      await this.findTxns();
    }

      findTxns = async () => {
        const { account } = this.props;
        const history = await account.activity
          .list({ filterTypes: ['payment_v1', 'payment_v2'] }).then((txn) => txn.take(5));
        history.filter((txn) => txn.type === 'payment_v1').map((txn) => {
          txn.payments = [{ payee: txn.payee, amount: txn.amount }];
          delete txn.payee; delete txn.amount;
          return txn;
        });
        this.setState({ history });
      };

      render() {
        const { history } = this.state;
        const { textClass } = this.props;
        return (
          <>
            {!history ? (
              <p className={textClass}>Loading your recent transactions...</p>
            ) : (
              <>
                {history.map((txn, idx) => (
                  <div key={idx}>
                    <hr />
                    {`Date: ${new Date(txn.time * 1000).toLocaleDateString()}`}
                    <br />
                    { `Payer: ${txn.payer}` }
                    <br />
                    { txn.payments.map((payments) => (
                      <div key={payments}>
                        { `[ Payee: ${payments.payee}`}
                        <br />
                        {`Amount: ${(payments.amount.integerBalance * 0.00000001)} ]`}
                        <br />
                      </div>
                    ))}
                    {`Fee: ${txn.fee.integerBalance}` }
                    <br />
                  </div>
                ))}
              </>
            )}
          </>
        );
      }
}
export default ShowTransactions;
