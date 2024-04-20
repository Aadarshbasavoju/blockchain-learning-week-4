const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProductSupplyChain", function () {
    let ProductSupplyChain;
    let productSupplyChain;
    let owner;
    let addr1;
    let addr2;
    let addr3;
    let productId;

    beforeEach(async function () {
        ProductSupplyChain = await ethers.getContractFactory("ProductSupplyChain");
        [owner, addr1, addr2, addr3] = await ethers.getSigners();
        productSupplyChain = await ProductSupplyChain.deploy();
        await productSupplyChain.deployed();

        // Create a product
        await productSupplyChain.createProduct(1, "Test Product", 100);
        productId = 1;
    });

    it("should create a product", async function () {
        const product = await productSupplyChain.products(productId);
        expect(product.productId).to.equal(1);
        expect(product.name).to.equal("Test Product");
        expect(product.currentOwner).to.equal(owner.address);
        expect(product.price).to.equal(100);
        expect(product.state).to.equal(0); // 0 means Created
    });

    it("should not create a product with existing ID", async function () {
        await expect(productSupplyChain.createProduct(1, "Another Product", 200)).to.be.revertedWith("Product with this ID already exists");
    });

    it("should not sell a non-existent product", async function () {
        await expect(productSupplyChain.sellProduct(2, addr1.address)).to.be.revertedWith("Product does not exist");
    });

    it("should sell a product to a new owner", async function () {
        await productSupplyChain.connect(addr1).sellProduct(productId, addr2.address);
        const product = await productSupplyChain.products(productId);
        expect(product.currentOwner).to.equal(addr2.address);
        expect(product.state).to.equal(1); // 1 means Sold
    });

    it("should not sell a product if not the owner", async function () {
        await expect(productSupplyChain.connect(addr1).sellProduct(productId, addr2.address)).to.be.revertedWith("You are not the owner of this product");
    });

    it("should emit ProductSold event when product is sold", async function () {
        await expect(productSupplyChain.connect(addr1).sellProduct(productId, addr2.address))
            .to.emit(productSupplyChain, "ProductSold")
            .withArgs(productId, owner.address, addr2.address, 100);
    });

    it("should transfer ownership to another address", async function () {
        await productSupplyChain.transferOwnership(addr1.address);
        await productSupplyChain.connect(addr1).acceptOwnership();
        expect(await productSupplyChain.owner()).to.equal(addr1.address);
    });

    it("should not transfer ownership if not the owner", async function () {
        await expect(productSupplyChain.connect(addr1).transferOwnership(addr2.address)).to.be.revertedWith("Ownable: caller is not the owner");
    });
});
