const main = async () => {
  const [owner, superCoder] = await hre.ethers.getSigners();
  const domainContractFactory = await hre.ethers.getContractFactory("Domains");
  //This is where we pass in the domain name argument, here it's cat for .cat
  const domainContract = await domainContractFactory.deploy("cat");
  await domainContract.deployed();
  console.log("Contract deployed to: ", domainContract.address);

  // We're passing in a second variable - value. This is the money!
  let txn = await domainContract.register("dog", { value: hre.ethers.utils.parseEther('1234')});
  await txn.wait();

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log("Contract balance: ", hre.ethers.utils.formatEther(balance));

  //quick! grab the funds from the contract! (as the superCoder)
  try {
    txn = await domainContract.connect(superCoder).withdraw();
    await txn.wait();
  } catch (e) {
    console.error("Could not rob contract, dangit!");
  }

  //lets look in their wallet so we can compare later
  let ownerBalance = await hre.ethers.provider.getBalance(owner.address);
  console.log("Balance of owner before withdrawal:", hre.ethers.utils.formatEther(ownerBalance));

  //oops, looks like the owner is saving their money!
  txn = await domainContract.connect(owner).withdraw();
  await txn.wait();

  //fetch balance of contract and owner
  const contractBalance = await hre.ethers.provider.getBalance(domainContract.address);
  ownerBalance = await hre.ethers.provider.getBalance(owner.address);

  console.log("Contract balance after withdrawal: ", hre.ethers.utils.formatEther(contractBalance));
  console.log("Owner balance after withdrawal: ", hre.ethers.utils.formatEther(ownerBalance));

  const address = await domainContract.getAddress("dog");
  console.log("Owner of domain dog: ", address);




};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

runMain();