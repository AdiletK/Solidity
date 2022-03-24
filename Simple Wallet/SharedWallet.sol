pragma solidity 0.8.1;

import "./Allowance.sol";

contract SharedWallet is Allowance {

    event MoneySent(address indexed _to, uint _amount);
    event MoneyReceived(address indexed _from, uint _amount);

    modifier checkBalanceOfSmartContract(uint _amount) {
        require(_amount <= address(this).balance, "Contract doesn't own enough money!");
        _;
    }

    function withdrawMoney(address payable _to, uint _amount) public ownerOrAllowed(_amount) checkBalanceOfSmartContract(_amount) {
        if (!isOwner()) {
            reduceAllowance(_to, _amount);
        }
        emit MoneySent(_to, _amount);
        _to.transfer(_amount);
    } 

    function renounceOwnership() public override view onlyOwner {
        revert("can't renounceOwnership here!");
    }

    receive() external payable {
        emit MoneyReceived(msg.sender, msg.value);
    }
}