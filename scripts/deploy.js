const main = async () => {
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const domainContract = await domainContractFactory.deploy("cat");
  await domainContract.deployed();

  console.log("Contract deployed to:", domainContract.address);

	let txn = await domainContract.register("doggos",  {value: hre.ethers.utils.parseEther("0.1")});
	await txn.wait();
  console.log("Minted domain doggos.cat");

  txn = await domainContract.setRecord("doggos", "104.197.156.77");
  await txn.wait();
  console.log("Set record for doggos.cat");

  const address = await domainContract.getAddress("doggos");
  console.log("Owner of domain doggo:", address);

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();