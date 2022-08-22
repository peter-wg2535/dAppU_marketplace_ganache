const hre =require("hardhat")
const contract_json=require("../artifacts/contracts/Greeter.sol/Greeter.json")
const { greeting_contract_address } = require("../helper-hardhat-config");
const abi=contract_json.abi


async function main(){

// const provider=new hre.ethers.providers.AlchemyProvider(
//     'maticmum',process.env.ALCHEMY_MUMBAI_API_KEY
// )
const provider=new hre.ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

const userPK="45e75374208bef428f4b650da350f13d7e59ff8b566ae23c989b50384da2b61c"
//const userWallet = new hre.ethers.Wallet(userPK, provider);

//hardhat.config.js
// accounts: [
//     "45e75374208bef428f4b650da350f13d7e59ff8b566ae23c989b50384da2b61c",
//     "8ac271a7bef89b3ffe12fe77f5f9bce308b6c5ffef887186e5094f779002f5e9"
//   ],
const userWallet= provider.getSigner(0); 
console.log("User Waller Address : "+await userWallet.getAddress())

const greeting_ct=new hre.ethers.Contract(
    greeting_contract_address
    ,abi
    ,userWallet)
const setTx1=await greeting_ct.setGreeting("Hi Web3 Alchemy Project!")
await setTx1.wait()

const greet_msg=await greeting_ct.greet()
console.log("After set message :"+ greet_msg)


}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
