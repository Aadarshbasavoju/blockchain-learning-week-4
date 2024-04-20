# ProductSupplyChain Smart Contract

## Overview

The `ProductSupplyChain` smart contract is a sophisticated Ethereum contract that simulates a basic supply chain process for a product. It allows users to create products, sell them, and transfer ownership of the products. This contract showcases advanced Solidity features such as access control, event logging, and error handling.

## Contract Process

1. **Product Creation**: Users can create new products by providing unique identifiers, names, and prices. Upon creation, the creator becomes the owner of the product.

2. **Product Sale**: Owners of products can sell them to other addresses by specifying the product ID and the new owner's address. The ownership is transferred, and the product state is updated to "Sold".

3. **Ownership Transfer**: The contract owner can transfer ownership of the entire contract to another address.

## Assumptions

- Each product has a unique identifier (product ID).
- Products are initially created in the "Created" state and can only be sold once.
- Only the owner of a product can sell it to another address.
- Ownership of the contract can be transferred by the contract owner only.

## Specific Conditions

- The contract uses OpenZeppelin's Ownable contract for ownership management.
- Events are emitted for actions such as product creation and sale.
- Error handling is implemented for scenarios like duplicate product IDs and unauthorized actions.

## Testing

Comprehensive unit tests for the contract are provided using Hardhat. These tests cover all possible happy paths and bad paths to ensure the contract functions as expected. Test cases include:

1. Product creation with unique IDs and duplicate IDs.
2. Selling a product with correct ownership and incorrect ownership.
3. Transferring ownership of the contract.

