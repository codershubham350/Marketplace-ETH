const CourseMarketplace = artifacts.require("CourseMarketplace");
const { catchRevert } = require("./utils/exceptions");

contract("CourseMarketplace", (accounts) => {
  const courseId = "0x00000000000000000000000000003130";
  const proof =
    "0x0000000000000000000000000000313000000000000000000000000000003130";
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
      const course = await _contract.getCoursebyHash(courseHash);

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
      const course = await _contract.getCoursebyHash(courseHash);
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
});
