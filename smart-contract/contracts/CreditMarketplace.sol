// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract CreditMarketplace is Ownable, ReentrancyGuard {
    IERC20 public creditToken;
    uint256 public platformFeePercent = 2; // 2% platform fee
    address public feeRecipient;

    struct Listing {
        uint256 id;
        address seller;
        uint256 amount;
        uint256 pricePerCredit; // in Wei
        bool active;
    }

    uint256 public nextListingId = 1;
    mapping(uint256 => Listing) public listings;

    event ListingCreated(uint256 indexed listingId, address indexed seller, uint256 amount, uint256 pricePerCredit);
    event ListingPurchased(uint256 indexed listingId, address indexed buyer, address indexed seller, uint256 amount, uint256 totalPrice);
    event ListingCanceled(uint256 indexed listingId, address indexed seller);

    constructor(address _creditToken, address _feeRecipient) Ownable(msg.sender) {
        creditToken = IERC20(_creditToken);
        feeRecipient = _feeRecipient;
    }

    function listCredits(uint256 amount, uint256 pricePerCredit) external nonReentrant {
        require(amount > 0, "Amount must be greater than zero");
        require(pricePerCredit > 0, "Price must be greater than zero");

        // Escrow the tokens
        require(creditToken.transferFrom(msg.sender, address(this), amount), "Token transfer failed");

        listings[nextListingId] = Listing({
            id: nextListingId,
            seller: msg.sender,
            amount: amount,
            pricePerCredit: pricePerCredit,
            active: true
        });

        emit ListingCreated(nextListingId, msg.sender, amount, pricePerCredit);
        nextListingId++;
    }

    function buyCredits(uint256 listingId) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing is not active");
        
        // Calculate total price in Wei. Note: BCC has 18 decimals, so pricePerCredit is the price for 1 * 10^18 BCC tokens (1 full credit).
        // Total price = (amount * pricePerCredit) / 10^18
        uint256 totalPrice = (listing.amount * listing.pricePerCredit) / 1e18;
        require(msg.value >= totalPrice, "Insufficient payment");

        listing.active = false;

        uint256 fee = (totalPrice * platformFeePercent) / 100;
        uint256 sellerProceeds = totalPrice - fee;

        // Transfer tokens to buyer
        require(creditToken.transfer(msg.sender, listing.amount), "Token transfer to buyer failed");

        // Distribute funds
        if (fee > 0) {
            payable(feeRecipient).transfer(fee);
        }
        payable(listing.seller).transfer(sellerProceeds);

        // Refund excess native tokens
        uint256 refund = msg.value - totalPrice;
        if (refund > 0) {
            payable(msg.sender).transfer(refund);
        }

        emit ListingPurchased(listingId, msg.sender, listing.seller, listing.amount, totalPrice);
    }

    function cancelListing(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing is not active");
        require(listing.seller == msg.sender, "Only seller can cancel");

        listing.active = false;

        // Return tokens to seller
        require(creditToken.transfer(msg.sender, listing.amount), "Token return failed");

        emit ListingCanceled(listingId, msg.sender);
    }

    function updatePlatformFee(uint256 _feePercent) external onlyOwner {
        require(_feePercent <= 10, "Fee cannot exceed 10%");
        platformFeePercent = _feePercent;
    }

    function updateFeeRecipient(address _feeRecipient) external onlyOwner {
        require(_feeRecipient != address(0), "Invalid recipient address");
        feeRecipient = _feeRecipient;
    }
}
