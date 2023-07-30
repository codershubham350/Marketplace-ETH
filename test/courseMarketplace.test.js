const CourseMarketplace = artifacts.require("CourseMarketplace");
const { catchRevert } = require("./utils/exceptions");

const getBalance = async (address) => await web3.eth.getBalance(address);
const toBN = (value) => web3.utils.toBN(value);

const getGas = async (result) => {
  const tx = await web3.eth.getTransaction(result.tx);
  const gasUsed = toBN(result.receipt.gasUsed);
  const gasPrice = toBN(tx.gasPrice);
  const gas = gasUsed.mul(gasPrice);
  return gas;
};

contract("CourseMarketplace", (accounts) => {
  const courseId = "0x00000000000000000000000000003130";
  const proof =
    "0x0000000000000000000000000000313000000000000000000000000000003130";

  const courseId2 = "0x00000000000000000000000000002130";
  const proof2 =
    "0x0000000000000000000000000000313000000000000000000000000000002130";

  const value = "900000000";

  let _contract = null;
  let contractOwner = null;
  let buyer = null;
  let courseHash = null;

  before(async () => {
    _contract = await CourseMarketplace.deployed();
    contractOwner = accounts[0];
    buyer = accounts[1];

    // console.log(_contract);
    // console.log(contractOwner);
    // console.log(buyer);
  });

  describe("Purchase the New Course", () => {
    before(async () => {
      await _contract.purchaseCourse(courseId, proof, {
        from: buyer,
        value,
      });
    });

    it("Should NOT allow to repurchase already owned course", async () => {
      await catchRevert(
        _contract.purchaseCourse(courseId, proof, {
          from: buyer,
          value,
        })
      );
    });

    it("Can get the purchased course hash by index", async () => {
      const index = 0;
      courseHash = await _contract.getCourseHashAtIndex(index);

      const expectedHash = web3.utils.soliditySha3(
        { type: "bytes16", value: courseId },
        { type: "address", value: buyer }
      );

      assert.equal(
        courseHash,
        expectedHash,
        "Course hash is not matching the hash of purchased course!"
      );
    });

    it("Should match the data of the course purchased by buyer", async () => {
      const expectedIndex = 0;
      const expectedState = 0;
      const course = await _contract.getCourseByHash(courseHash);

      assert.equal(course.id, expectedIndex, "Course index should be 0!");
      assert.equal(course.price, value, `Course price should be ${value}!`);
      assert.equal(course.proof, proof, `Course proof should be ${proof}!`);
      assert.equal(course.owner, buyer, `Course buyer should be ${buyer}!`);
      assert.equal(
        course.state,
        expectedState,
        `Course state should be ${expectedState}!`
      );
    });
  });

  describe("Activate the purchased Course", () => {
    it("Should NOT be able to Activate course by NOT Contract owner", async () => {
      await catchRevert(_contract.activateCourse(courseHash, { from: buyer }));
    });

    it("Should have 'Activated' state", async () => {
      await _contract.activateCourse(courseHash, { from: contractOwner });
      const course = await _contract.getCourseByHash(courseHash);
      const expectedState = 1;

      assert.equal(
        course.state,
        expectedState,
        "Course should have 'activated' state"
      );
    });
  });

  describe("Transfer Ownership", () => {
    let currentOwner = null;
    before(async () => {
      currentOwner = await _contract.getContractOwner();
    });

    it("GetContractOwner should return deployer address", async () => {
      assert.equal(
        contractOwner,
        currentOwner,
        "Contract Owner is not matching the one from GetContractOwner function"
      );
    });

    it("Should NOT transfer ownership if owner is NOT sending Transaction", async () => {
      await catchRevert(
        _contract.transferOwnership(accounts[3], { from: accounts[4] })
      );
    });

    it("Should transfer ownership to 3rd address from 'accounts'", async () => {
      await _contract.transferOwnership(accounts[2], { from: contractOwner });
      await catchRevert(
        _contract.transferOwnership(accounts[2], { from: currentOwner })
      );
      const owner = await _contract.getContractOwner();
      assert.equal(
        owner,
        accounts[2],
        "Contract Owner is not the second account"
      );
    });

    it("Should transfer ownership back to initial contract owner", async () => {
      await _contract.transferOwnership(contractOwner, {
        from: accounts[2],
      });
      await catchRevert(
        _contract.transferOwnership(contractOwner, { from: accounts[2] })
      );
      const owner = await _contract.getContractOwner();
      assert.equal(owner, contractOwner, "Contract Owner is not set!");
    });
  });

  describe("Deactivate Course", () => {
    let courseHash2 = null;
    let currentOwner = null;
    before(async () => {
      await _contract.purchaseCourse(courseId2, proof2, { from: buyer, value });
      courseHash2 = await _contract.getCourseHashAtIndex(1);
      currentOwner = await _contract.getContractOwner();
    });

    it("Should not be able to Deactivate the course by NOT contract owner", async () => {
      await catchRevert(
        _contract.deactivateCourse(courseHash2, { from: buyer })
      );
    });

    it("Should have status of Deactivated and price 0", async () => {
      const beforeTxBuyerBalance = await getBalance(buyer);
      const beforeTxContractBalance = await getBalance(_contract.address);
      const beforeTxOwnerBalance = await getBalance(currentOwner);

      const result = await _contract.deactivateCourse(courseHash2, {
        from: contractOwner,
      });

      const afterTxBuyerBalance = await getBalance(buyer);
      const afterTxContractBalance = await getBalance(_contract.address);
      const afterTxOwnerBalance = await getBalance(currentOwner);

      const course = await _contract.getCourseByHash(courseHash2);
      const expectedState = 2;
      const expectedPrice = 0;
      const gas = await getGas(result);

      assert.equal(course.state, expectedState, "Course is NOT Deactivated");
      assert.equal(course.price, expectedPrice, "Course price is NOT 0!");

      assert.equal(
        toBN(beforeTxOwnerBalance).sub(gas).toString(),
        afterTxOwnerBalance,
        "Buyer balance is NOT correct"
      );
      assert.equal(
        toBN(beforeTxBuyerBalance).add(toBN(value)).toString(),
        afterTxBuyerBalance,
        "Buyer balance is NOT correct"
      );

      assert.equal(
        toBN(beforeTxContractBalance).sub(toBN(value)).toString(),
        afterTxContractBalance,
        "Contract balance is NOT correct"
      );
    });

    it("Should NOT be able to activate deactivated course", async () => {
      await catchRevert(
        _contract.activateCourse(courseHash2, { from: contractOwner })
      );
    });
  });

  describe("Repurchase Course", () => {
    let courseHash2 = null;

    before(async () => {
      courseHash2 = await _contract.getCourseHashAtIndex(1);
    });

    it("It should NOT Repurchase when the course doesn't exist", async () => {
      const notExistingHash =
        "0xaa2a944939fd0cf617385c313e12b40ae12e5b68f043d909a5c33ff204557e86";
      await catchRevert(
        _contract.repurchaseCourse(notExistingHash, { from: buyer })
      );
    });

    it("It should NOT Repurchase with NOT course owner", async () => {
      const notOwnerAddress = accounts[2];
      await catchRevert(
        _contract.repurchaseCourse(courseHash2, { from: notOwnerAddress })
      );
    });

    it("Should be able to Repurchase with original buyer", async () => {
      const beforeTxBuyerBalance = await getBalance(buyer);
      const beforeTxContractBalance = await getBalance(_contract.address);

      const result = await _contract.repurchaseCourse(courseHash2, {
        from: buyer,
        value,
      });

      const afterTxBuyerBalance = await getBalance(buyer);
      const afterTxContractBalance = await getBalance(_contract.address);

      const course = await _contract.getCourseByHash(courseHash2);
      const expectedState = 0;
      const gas = await getGas(result);

      assert.equal(
        course.state,
        expectedState,
        "The course is NOT in purchased state"
      );

      assert.equal(
        course.price,
        value,
        `The course price is NOT equal to ${value}`
      );

      // toBN ->  Big Number to perform operations
      assert.equal(
        toBN(beforeTxBuyerBalance).sub(toBN(value)).sub(gas).toString(),
        afterTxBuyerBalance,
        "Client balance is NOT Correct!"
      );

      assert.equal(
        toBN(beforeTxContractBalance).add(toBN(value)).toString(),
        afterTxContractBalance,
        "Client balance is NOT Correct!"
      );
    });

    it("It should NOT be able to Repurchase purchased course", async () => {
      await catchRevert(
        _contract.repurchaseCourse(courseHash2, { from: buyer })
      );
    });
  });

  describe("Receive Funds", () => {
    it("Should have Transacted Funds", async () => {
      const value = "100000000000000000";
      const contractBeforeTx = await getBalance(_contract.address);

      await web3.eth.sendTransaction({
        from: buyer,
        to: _contract.address,
        value,
      });

      const contractAfterTx = await getBalance(_contract.address);

      assert.equal(
        toBN(contractBeforeTx).add(toBN(value)).toString(),
        contractAfterTx,
        "Value after transaction is not matching!"
      );
    });
  });

  describe("Normal Withdraw", () => {
    const fundsToDeposit = "100000000000000000";
    const overLimitFunds = "999999000000000000000";
    let currentOwner = null;

    before(async () => {
      currentOwner = await _contract.getContractOwner();
      await web3.eth.sendTransaction({
        from: buyer,
        to: _contract.address,
        value: fundsToDeposit,
      });
    });

    it("Should fail when withdrawing with NOT owner address", async () => {
      const value = "10000000000000000";
      await catchRevert(_contract.withdraw(value, { from: buyer }));
    });

    it("Should fail when withdrawing OVER limit balance", async () => {
      await catchRevert(
        _contract.withdraw(overLimitFunds, { from: currentOwner })
      );
    });

    it("Should have +0.1ETH after withdraw", async () => {
      const ownerBalance = await getBalance(currentOwner);
      const result = await _contract.withdraw(fundsToDeposit, {
        from: currentOwner,
      });
      const newOwnerBalance = await getBalance(currentOwner);
      const gas = await getGas(result);

      assert.equal(
        toBN(ownerBalance).add(toBN(fundsToDeposit)).sub(gas).toString(),
        newOwnerBalance,
        "The new owner balance is not correct!"
      );
    });
  });

  describe("Emergency Withdraw", () => {
    let currentOwner;

    before(async () => {
      currentOwner = await _contract.getContractOwner();
    });

    after(async () => {
      await _contract.resumeContract({ from: currentOwner });
    });

    it("Should fail when contract is NOT stopped", async () => {
      await catchRevert(_contract.emergencyWithdraw({ from: currentOwner }));
    });

    it("Should have +contract funds on contract owner", async () => {
      await _contract.stopContract({ from: contractOwner });

      const contractBalance = await getBalance(_contract.address);
      const ownerBalance = await getBalance(currentOwner);

      const result = await _contract.emergencyWithdraw({ from: currentOwner });
      const gas = await getGas(result);

      const newOwnerBalance = await getBalance(currentOwner);

      assert.equal(
        toBN(ownerBalance).add(toBN(contractBalance)).sub(gas).toString(),
        newOwnerBalance,
        "Owner doesn't have contract balance"
      );
    });

    it("Should have contract balance of 0", async () => {
      const contractBalance = await getBalance(_contract.address);

      assert.equal(
        contractBalance,
        0,
        "Contract balance doesn't have 0 balance"
      );
    });
  });

  describe("Self Destruct", () => {
    let currentOwner;

    before(async () => {
      currentOwner = await _contract.getContractOwner();
    });

    it("Should fail when contract is NOT stopped", async () => {
      await catchRevert(_contract.selfDestruct({ from: currentOwner }));
    });

    it("Should have +contract funds on contract owner", async () => {
      await _contract.stopContract({ from: contractOwner });

      const contractBalance = await getBalance(_contract.address);
      const ownerBalance = await getBalance(currentOwner);

      const result = await _contract.selfDestruct({ from: currentOwner });
      const gas = await getGas(result);

      const newOwnerBalance = await getBalance(currentOwner);

      assert.equal(
        toBN(ownerBalance).add(toBN(contractBalance)).sub(gas).toString(),
        newOwnerBalance,
        "Owner doesn't have contract balance"
      );
    });

    it("Should have contract balance of 0", async () => {
      const contractBalance = await getBalance(_contract.address);

      assert.equal(
        contractBalance,
        0,
        "Contract balance doesn't have 0 balance"
      );
    });

    it("Should have 0x bytecode", async () => {
      const code = await web3.eth.getCode(_contract.address);

      assert.equal(code, "0x", "Contract is not destroyed");
    });
  });
});
