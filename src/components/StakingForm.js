import React, { Component } from "react";
import Web3 from "web3";
import dai from "../dai.png";

class StakingForm extends Component {
  submitForStake = (event) => {
    event.preventDefault();
    let amount;
    amount = this.input.value.toString();
    amount = window.web3.utils.toWei(amount, "Ether");
    this.props.stakeTokens(amount);
  };

  render() {
    return (
      <div className="card mb-4">
        <div className="card-body">
          <form className="mb-3" onSubmit={this.submitForStake}>
            <div>
              <label className="float-left">
                <b>Stake Token</b>
              </label>
              <span className="float-right text-muted">
                Balance:{" "}
                {Web3.utils.fromWei(this.props.daiTokenBalance, "Ether")}
              </span>
            </div>
            <div className="input-group mb-4">
              <input
                type="text"
                ref={(input) => {
                  this.input = input;
                }}
                className="form-control form-control-lg"
                placeholder="0"
                required
              />
              <div className="input-group-apend">
                <div className="input-group-text">
                  <img src={dai} height="32" alt="" />
                  &nbsp;&nbsp;&nbsp; mDAI
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block btn-lg">
              STAKE!
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default StakingForm;
