// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BlueCarbonCredit is ERC20, Ownable {

    mapping(string => bool) public projectIssued;

    constructor() ERC20("BlueCarbonCredit", "BCC") Ownable(msg.sender) {}

    function mint(
        address to,
        uint256 amount,
        string memory projectId
    ) public onlyOwner {

        require(!projectIssued[projectId], "Credits already issued for this project");

        projectIssued[projectId] = true;

        _mint(to, amount);
    }
}