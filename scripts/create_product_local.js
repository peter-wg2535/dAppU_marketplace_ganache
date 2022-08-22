const { ethers } = require("hardhat");
const { marketplace_contract_address } = require("../helper-hardhat-config");
const prompt = require("prompt-sync")();
const marketplace_JSON = require("../artifacts/contracts/Marketplace.sol/Marketplace.json");
const abi = marketplace_JSON.abi;

// npx hardhat node  OR ganahce node   url: 'http://localhost:8545'
const provider=new hre.ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

let product_name = "";
let product_price = "";

const creatable = false;

async function main() {
  try {
    // get private-key or account-address from ganache-ui
    const seller_wallet = new ethers.Wallet("45e75374208bef428f4b650da350f13d7e59ff8b566ae23c989b50384da2b61c",provider);
    // const seller_wallet = await ethers.getSigner("0xBEf5dc429aab8754194717be22433DEC3EDc514E");
    //const seller_wallet =  provider.getSigner(0); // get index=0    
    //// for hardhat /ganaceh node  network section on hardhat.config.js

    console.log("Create product by seller");
    console.log("Address " + (await seller_wallet.getAddress()));
    console.log(
      "ETH Balance " +
        ethers.utils.formatEther(await seller_wallet.getBalance())
    );
    console.log(marketplace_contract_address)

    const marketplace = new ethers.Contract(
      marketplace_contract_address,
      abi,
      seller_wallet
    );
    if (creatable) {
      console.log(
        "======================Creating product.====================="
      );
      const param_name = prompt("Enter Product Name ? : ");
      product_name = param_name;
      const param_price = prompt("Enter Product Price (Eth) ? : ");
      console.log(
        "Procut Name  " + product_name + " -  " + param_price + " eth"
      );
      const param_y = prompt("Press y to add product :  ");
      if (param_y == "y") {
        product_price = ethers.utils.parseEther(param_price.toString());
        if (product_name && product_price > 0) {
          // createProduct(string memory _name, uint256 _price)
          const txCreateProduct = await marketplace.createProduct(
            product_name,
            product_price
          );
          await txCreateProduct.wait();
          console.log(txCreateProduct);
          console.log("Create product successuflly.");
          console.log(
            "=====================Created product successuflly.=================="
          );
        }
      }
    }

    console.log("======================List product info.=====================");
    const product_count = await marketplace.getProductCount();
    console.log("The number of products in system :" + product_count);

    for (let id = 1; id <= product_count; id++) {
      const product_detail = await marketplace.getProduct(id);
      if (product_detail.id > 0) {
        console.log("ID: " + ethers.utils.formatUnits(product_detail.id, 0));
        console.log(
          "Name: " +
            product_detail.name +
            " , Price: " +
            ethers.utils.formatEther(product_detail.price) +
            " eth"
        );
        console.log(
          "Owner: " +
            product_detail.owner +
            " , Is Purchased : " +
            product_detail.purchased
        );

        console.log(
          "**********************************************************************"
        );
      } else {
        console.log("not found proudct of this id");
      }
    }
  } catch (error) {
    console.log(error.toString());
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
