pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    string public name = "DApp Token Farm";

    DappToken public dappToken;
    DaiToken public daiToken;
    address public owner;

    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;
    address[] public stakers;

    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        // store reference to daap and dai tokens
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    function stakeTokens(uint256 _amount) public {
        require(_amount > 0, "amount cannot be 0");

        // get stakers tokens
        daiToken.transferFrom(msg.sender, address(this), _amount);
        // update staked balance for sender
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;
        // add to staker list iff not already there
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }
        //update staking status
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    function unstakeTokens() public {
        uint256 balance = stakingBalance[msg.sender];
        require(balance > 0, "staking balance cannot be 0");

        //return all staked dai
        daiToken.transfer(msg.sender, balance);

        // reset
        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
    }

    function issueTokens() public {
        require(msg.sender == owner, "caller must be owner");

        // issue 1 token for each dai staked to each staker
        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            if (isStaking[recipient]) {
                uint256 balance = stakingBalance[recipient];
                if (balance > 0) {
                    dappToken.transfer(recipient, balance);
                }
            }
        }
    }
}
