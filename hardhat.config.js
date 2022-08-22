require("@nomiclabs/hardhat-waffle");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.4",
  networks: {
    ganache: {
      url: "http://127.0.0.1:8545",
      accounts: [
        "45e75374208bef428f4b650da350f13d7e59ff8b566ae23c989b50384da2b61c",
        "8ac271a7bef89b3ffe12fe77f5f9bce308b6c5ffef887186e5094f779002f5e9"
      ],
    },
  },
};
