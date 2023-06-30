// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CourseMarketplace {
    enum State {
        Purchased,
        Activated,
        Deactivated
    }

    struct Course {
        uint id; // 32 byte
        uint price; // 32 byte
        bytes32 proof; // 32 byte
        address owner; // 20 byte
        State state; // 1 byte
    }

    // mapping of courseHash to Course data
    mapping(bytes32 => Course) private ownedCourses;

    // mapping od courseID to courseHash
    mapping(uint => bytes32) private ownedCourseHash;

    // number of all courses + id of the course
    uint private totalOwnedCourses;

    // owner of contract
    address payable private owner;

    constructor() {
        setContractOwner(msg.sender);
    }

    // below is a message for error and not a comment
    /// Course has already a Owner!
    error CourseHasOwner();

    /// Only Owner has an Access!
    error restrictedToOnlyOwner();

    modifier onlyOwner() {
        if (msg.sender != getContractOwner()) {
            revert restrictedToOnlyOwner();
        }
        _;
    }

    function purchaseCourse(bytes16 courseId, bytes32 proof) external payable {
        bytes32 courseHash = keccak256(abi.encodePacked(courseId, msg.sender));
        if (hasCourseOwnership(courseHash)) {
            revert CourseHasOwner();
        }
        uint id = totalOwnedCourses++;
        ownedCourseHash[id] = courseHash;
        ownedCourses[courseHash] = Course({
            id: id,
            price: msg.value,
            proof: proof,
            owner: msg.sender,
            state: State.Purchased
        });
    }

    function transferOwnership(address newOwner) external onlyOwner {
        setContractOwner(newOwner);
    }

    function getCourseCount() external view returns (uint) {
        return totalOwnedCourses;
    }

    function getCourseHashAtIndex(uint index) external view returns (bytes32) {
        return ownedCourseHash[index];
    }

    function getCoursebyHash(
        bytes32 courseHash
    ) external view returns (Course memory) {
        return ownedCourses[courseHash];
    }

    function getContractOwner() public view returns (address) {
        return owner;
    }

    function setContractOwner(address newOwner) private {
        owner = payable(newOwner);
    }

    function hasCourseOwnership(
        bytes32 courseHash
    ) private view returns (bool) {
        return ownedCourses[courseHash].owner == msg.sender;
    }
}

/*    function purchaseCourse(
        bytes16 courseId, // 0x00000000000000000000000000003130 (16 bytes)
        bytes32 proof // sample prrof -> (64 bytes) -> 0x0000000000000000000000000000313000000000000000000000000000003130
    ) external payable {
        // course id - 10 (in hex 10 is 3130)
        // 0x00000000000000000000000000003130 (16 bytes)
        // 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4 (user address)
        // keccak256(abi.encodePacked(courseId, msg.sender)) -> 000000000000000000000000000031305B38Da6a701c568545dCfcB03FcB875f56beddC4
        // keccak256 - c4eaa3558504e2baa2669001b43f359b8418b44a4477ff417b4b007d7cc86e37
        bytes32 courseHash = keccak256(abi.encodePacked(courseId, msg.sender));

    } */
