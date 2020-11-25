import React, { Component } from 'react';
import { Client } from '@helium/http';

const delay = (ms) => new Promise((success) => setTimeout(success, ms));
const client = new Client();

class PendingTxn extends Component {
    state = {
      time: null,
      pendingTxns: null,
    };

    refresh = setInterval(() => {
      const { time } = this.state;
      if (time < 1) return;
      this.setState((prevState) => ({ time: (prevState.time - 1).toFixed() }));
    }, 1000);

    async componentDidMount() {
      while (localStorage.getItem('pending')) {
        const stats = await client.stats.get();
        const blocktime = stats.blockTimes.lastHour.avg * 1000;
        await this.handlePending(false);
        await delay(blocktime);
      }
    }

    handlePending = async () => {
      if (!client) return;
      const stats = await client.stats.get();
      const blocktime = stats.blockTimes.lastHour.avg;
      const txnStatus = await client.pendingTransactions.get(localStorage.getItem('pending')).then((post) => post.take(1));
      this.setState({ pendingTxns: txnStatus[0].status, time: blocktime.toFixed(0) });
      if (txnStatus[0].status === 'cleared' || txnStatus[0].status === 'failed') {
        this.setState({ pendingTxns: txnStatus[0].status, time: null });
        localStorage.removeItem('pending');
      }
    };

    render() {
      const { account, textClass } = this.props;
      const { time, pendingTxns } = this.state;

      return (
        <div className={`${textClass} font-medium`}>
          <div>{account.address}</div>
          <div>{`Pending transaction: ${localStorage.getItem('pending')}`}</div>
          { time && <div>{`Re-checking status: ${time} seconds.`}</div>}
          { pendingTxns && <div>{`Status: ${pendingTxns}.`}</div> }
        </div>
      );
    }
}

export default PendingTxn;
