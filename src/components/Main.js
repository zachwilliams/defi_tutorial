import React, { Component } from "react";
import StakingForm from "./StakingForm";

class Main extends Component {
  render() {
    return (
      <div id="content" className="mt-3">
        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">Staking Balance</th>
              <th scope="col">Reward Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {window.web3.utils.fromWei(this.props.stakingBalance, "Ether")}
                {" mDAI"}
              </td>
              <td>
                {window.web3.utils.fromWei(
                  this.props.dappTokenBalance,
                  "Ether"
                )}
                {" DAPP"}
              </td>
            </tr>
          </tbody>
        </table>

        <StakingForm
          daiTokenBalance={this.props.daiTokenBalance}
          stakeTokens={this.props.stakeTokens}
        />
      </div>
    );
  }
}

export default Main;
