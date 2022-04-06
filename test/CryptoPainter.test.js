// const CryptoPainting = artifacts.require("CryptoPainting");

// contract("CryptoPainting", (accounts) => {
//   let contract;

//   before(async () => {
//     contract = await CryptoPainting.deployed();
//   });

//   describe("deployment", async () => {
//     it("deploys successfully", async () => {
//       const address = contract.address;
//       assert.notEqual(address, "");
//       assert.notEqual(address, 0x0);
//       assert.notEqual(address, null);
//       assert.notEqual(address, undefined);
//     });

//     it("has a name", async () => {
//       const name = await contract.name();
//       assert.equal(name, "CryptoPainting");
//     });

//     it("has a symbol", async () => {
//       const symbol = await contract.symbol();
//       assert.equal(symbol, "CPA");
//     });
//   });

//   // describe("minting", async () => {
//   //   it("receives uri correctly", async () => {
//   //     const result = await contract.awardItem("jaklsdfjlk", "hash", "metadata");
//   //   });
//   // });

//   // describe("minting", async () => {
//   //   it("creates a  new token", async () => {
//   //     // const result = await contract.awardItem("#ffffff");
//   //     // SUCCESS
//   //     // const event = result.logs[0].args;
//   //     // assert.equal(event.tokenId.toNumber(), 0, "id is correct");
//   //     // assert.equal(
//   //     //   event.from,
//   //     //   "0x0000000000000000000000000000000000000000",
//   //     //   "from is correct"
//   //     // );
//   //     // assert.equal(event.to, accounts[0], "to is correct");
//   //     // FAILURE
//   //     // await contract.mint("#ffffff").should.be.rejected;
//   //   });
//   // });

//   // describe("indexing", async () => {
//   //   it("lists Nuggets", async () => {
//   //     // Mint 3 tokens
//   //     // await contract.mint("#000000");
//   //     // await contract.mint("#000001");
//   //     // await contract.mint("#000002");
//   //     // const totalSupply = await contract.totalSupply();
//   //     // let Nugget;
//   //     // let result = [];
//   //     // for (let i = 0; i < totalSupply; i++) {
//   //     //   Nugget = await contract.Nuggets(i);
//   //     //   result.push(Nugget);
//   //     // }
//   //     // let expected = ["#ffffff", "#000000", "#000001", "#000002"];
//   //     // assert.equal(result.join(","), expected.join(","));
//   //   });
//   // });
// });
