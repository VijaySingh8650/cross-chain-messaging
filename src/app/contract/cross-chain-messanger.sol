// contracts/MessengerApp.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@hyperlane-xyz/core/contracts/interfaces/IInterchainMessenger.sol";
import "@hyperlane-xyz/core/contracts/interfaces/IMessageRecipient.sol";

contract MessengerApp is IMessageRecipient {
    string public lastReceivedMessage;
    address public interchainMessenger;

    constructor(address _interchainMessenger) {
        interchainMessenger = _interchainMessenger;
    }

    function handle(
        uint32 origin,
        bytes32 sender,
        bytes calldata message
    ) external override {
        require(msg.sender == interchainMessenger, "Unauthorized");
        lastReceivedMessage = abi.decode(message, (string));
    }

    function sendMessage(
        uint32 destinationDomain,
        address recipient,
        string calldata message
    ) external {
        IInterchainMessenger(interchainMessenger).dispatch(
            destinationDomain,
            addressToBytes32(recipient),
            abi.encode(message)
        );
    }

    function addressToBytes32(address addr) public pure returns (bytes32) {
        return bytes32(uint256(uint160(addr)));
    }
}
