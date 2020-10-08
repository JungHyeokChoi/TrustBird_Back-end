pragma solidity ^0.5.0;

contract TrustBird {
    mapping(address => bytes32[]) private hashValueOfTrust;
    mapping(address => bytes32[]) private hashValueOfContract;
    
    address private owner;
    
    uint16 maxValue;
    
    uint32 public totalTrust;
    uint32 public totalContract;
    
    constructor() public {
        owner = msg.sender;
        maxValue = 65535;
    }
    
    function getHashValueOfTrust(address client) public view returns(bytes32[] memory) {
        return hashValueOfTrust[client];
    }
    
    function getHashValueOfContract(address client) public view returns(bytes32[] memory) {
        return hashValueOfContract[client];
    }
    
    function addHashValueOfTrust(address client, bytes32 hashValue, uint16 index) public {
        require(msg.sender == owner, "Wrong approach");
        
        totalTrust++;
        
        if(index == maxValue)
            hashValueOfTrust[client].push(hashValue);
        else
            hashValueOfTrust[client][index] = hashValue;
    }
    
    function addHashValueOfContract(address client, bytes32 hashValue, uint16 index) public {
        require(msg.sender == owner, "Wrong approach");
        
        totalContract++;
    
        if(index == maxValue)
            hashValueOfContract[client].push(hashValue);
        else
            hashValueOfContract[client][index] = hashValue;
    }
    
    function removeHashValueOfTrust(address client, uint16 index) public {
        require(msg.sender == owner, "Wrong approach");
        
        totalTrust--;
        delete hashValueOfTrust[client][index];
    }
    
    function removeHashValueOfContract(address client, uint16 index) public {
        require(msg.sender == owner, "Wrong approach");
        
        totalContract--;
        delete hashValueOfContract[client][index];
    }
}