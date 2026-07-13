// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract BlueCarbonCredit is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    struct ProjectRecord {
        bool issued;
        string evidenceHash; // IPFS CID of the evidence package
        bool retired;
    }

    mapping(string => ProjectRecord) public projects;
    mapping(string => uint256) public retiredAmounts;

    event CreditsMinted(string indexed projectId, address indexed to, uint256 amount, string evidenceHash);
    event CreditsRetired(string indexed projectId, address indexed by, uint256 amount);

    constructor() ERC20("BlueCarbonCredit", "BCC") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function mint(address to, uint256 amount, string memory projectId, string memory evidenceHash)
        public onlyRole(MINTER_ROLE)
    {
        require(!projects[projectId].issued, "Credits already issued for this project");
        require(amount > 0, "Amount must be greater than zero");
        projects[projectId] = ProjectRecord(true, evidenceHash, false);
        _mint(to, amount);
        emit CreditsMinted(projectId, to, amount, evidenceHash);
    }

    function retire(string memory projectId, uint256 amount) public {
        require(projects[projectId].issued, "Unknown project");
        require(balanceOf(msg.sender) >= amount, "ERC20: burn amount exceeds balance");
        _burn(msg.sender, amount);
        retiredAmounts[projectId] += amount;
        projects[projectId].retired = true;
        emit CreditsRetired(projectId, msg.sender, amount);
    }

    function getProject(string memory projectId) public view returns (bool issued, string memory evidenceHash, bool retired, uint256 retiredAmount) {
        ProjectRecord memory record = projects[projectId];
        return (record.issued, record.evidenceHash, record.retired, retiredAmounts[projectId]);
    }
}
