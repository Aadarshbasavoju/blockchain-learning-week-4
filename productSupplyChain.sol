// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin's Ownable contract for ownership management
import "@openzeppelin/contracts/access/Ownable.sol";

// Define the ProductSupplyChain contract inheriting from Ownable
contract ProductSupplyChain is Ownable {
    // Struct to represent a product
    struct Product {
        uint256 productId;
        string name;
        address currentOwner;
        uint256 price;
        uint8 state; // 0: Created, 1: Sold
    }

    // Mapping to store products by their ID
    mapping(uint256 => Product) public products;

    // Event to log when a product is created
    event ProductCreated(uint256 productId, string name, address owner, uint256 price);

    // Event to log when a product is sold
    event ProductSold(uint256 productId, address previousOwner, address newOwner, uint256 price);

    // Modifier to restrict functions to only the product owner
    modifier onlyProductOwner(uint256 _productId) {
        require(products[_productId].currentOwner == msg.sender, "You are not the owner of this product");
        _;
    }

    // Function to create a new product
    function createProduct(uint256 _productId, string memory _name, uint256 _price) external {
        require(products[_productId].productId == 0, "Product with this ID already exists");
        products[_productId] = Product(_productId, _name, msg.sender, _price, 0); // Set state to Created
        emit ProductCreated(_productId, _name, msg.sender, _price);
    }

    // Function to simulate product sale
    function sellProduct(uint256 _productId, address _newOwner) external onlyProductOwner(_productId) {
        Product storage product = products[_productId];
        require(product.state == 0, "Product has already been sold");

        // Transfer ownership
        product.currentOwner = _newOwner;
        product.state = 1; // Update state to Sold

        emit ProductSold(_productId, msg.sender, _newOwner, product.price);
    }

    // Function to transfer ownership of the contract
    function transferOwnership(address newOwner) public onlyOwner {
        _transferOwnership(newOwner);
    }
}
