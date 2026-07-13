// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract VerifierRegistry is AccessControl {
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function addVerifier(address verifier) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(VERIFIER_ROLE, verifier);
        emit VerifierAdded(verifier);
    }

    function removeVerifier(address verifier) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(VERIFIER_ROLE, verifier);
        emit VerifierRemoved(verifier);
    }

    function isVerifier(address verifier) public view returns (bool) {
        return hasRole(VERIFIER_ROLE, verifier);
    }
}
