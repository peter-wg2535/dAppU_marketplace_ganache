const { ethers } = require("hardhat");
const { marketplace_contract_address } = require("../helper-hardhat-config");
const prompt = require("prompt-sync")();

const marketplace_JSON = require("../artifacts/contracts/Marketplace.sol/Marketplace.json");
const abi = marketplace_JSON.abi;

// run on localhost
const provider = new ethers.providers.JsonRpcProvider();


async function main() {
  try {

    //const buyer_wallet= await ethers.getSigner("0xE8F7D7c1DD8E21ABb017d26ca9fA8a087b198ba4")
    const buyer_wallet=provider.getSigner(1)

    let p_id = 0;
    let p_price = 0;

    console.log("Buy product");
    console.log("Address " + (await buyer_wallet.getAddress()));
    console.log(
      "ETH Balance " + ethers.utils.formatEther(await buyer_wallet.getBalance())
    );

    const marketplace = new ethers.Contract(
      marketplace_contract_address ,
      abi,
      buyer_wallet
    );

    console.log(
      "======================List buyable product info.====================="
    );
    const product_count = await marketplace.getProductCount();

    let listBuyable = [];

    for (let id = 1; id <= product_count; id++) {
      const product_detail = await marketplace.getProduct(id);
      if (
        product_detail.purchased == false &&
        product_detail.owner != buyer_wallet.address
      ) {
        // if ( (product_detail.owner != buyer_wallet)){
        const product_id = ethers.utils.formatUnits(product_detail.id, 0);
        const product_price = ethers.utils.formatEther(product_detail.price);

        console.log(
          "ID: " + product_id + " - Price: " + product_price + " eth"
        );
        console.log(
          "Name: " +
            product_detail.name +
            " ,Owner: " +
            product_detail.owner +
            " , Is Purchased : " +
            product_detail.purchased
        );
        listBuyable.push({ id: product_id, price: product_price });
        console.log(
          "**********************************************************************"
        );
      }
    }

    if (listBuyable.length > 0) {
      const param_id = prompt("Enter Product ID? : ");
      let found_product = listBuyable.find((p) => p.id === param_id);
      if (found_product) {
        p_id = found_product.id;
        p_price = found_product.price;
        console.log("Purchase Product ID  " +found_product.id +" -  " +found_product.price +" eth")
        const param_y = prompt("Press y to buy :  ");
        if (param_y=='y'){
          console.log("======================Buy product.=====================");
          // purchaseProduct(uint256 _id) public payable
          if (p_price > 0 && p_id > 0) {
             const txBuyProduct = await marketplace.purchaseProduct(p_id, {
              value: ethers.utils.parseEther(p_price.toString()),
            });
            await txBuyProduct.wait();
            console.log(txBuyProduct);
            console.log("Buy product successuflly.")
          }
      

        }
         
      } 
      else console.log("Not found Product ID " + param_id);
    }
    else{
      console.log("No avaiable prouduct to buy.")
    }


    const product_count2 = await marketplace.getProductCount();
    console.log("======================List my product perchased.=====================")
    for (let id = 1; id <= product_count2; id++) {
      const product_detail=await marketplace.getProduct(id)
      if ( (product_detail.purchased==true) && (product_detail.owner == buyer_wallet.address)){
      console.log("ID: "+ethers.utils.formatUnits(product_detail.id,"0"))
      console.log("Name: "+product_detail.name+" , Price: "+ethers.utils.formatEther(product_detail.price)+" eth")
      console.log("Owner: "+product_detail.owner+" , Is Purchased : "+product_detail.purchased)
      console.log("**********************************************************************")
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
