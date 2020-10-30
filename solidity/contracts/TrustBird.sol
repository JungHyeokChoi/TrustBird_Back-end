pragma solidity ^0.5.0;

contract TrustBird {
    mapping(string => bytes32[]) private hashValueOfTrust;
    mapping(bytes32 => bytes32) private hashValueOfContract;
    
    address private owner;
    
    uint16 maxValue;
    
    uint32 public totalTrust;
    uint32 public totalContract;
    
    constructor() public {
        owner = msg.sender;
        maxValue = 65535;
    }

    function getHashValueOfTrust(string memory email) public view returns(bytes32[] memory) {
        return hashValueOfTrust[email];
    }
    
    function addHashValueOfTrust(string memory email, bytes32 token, uint16 index) public {
        require(msg.sender == owner, "Wrong approach");
        
        totalTrust++;
        
        if(index == maxValue)
            hashValueOfTrust[email].push(token);
        else
            hashValueOfTrust[email][index] = token;
    }

     function removeHashValueOfTrust(string memory email, uint16 index) public {
        require(msg.sender == owner, "Wrong approach");
        
        totalTrust--;
        delete hashValueOfTrust[email][index];
    }
    
    function getHashValueOfContract(bytes32 token) public view returns(bytes32) {
        return hashValueOfContract[token];
    }

    function addHashValueOfContract(bytes32 trustToken, bytes32 contractToken) public {
        require(msg.sender == owner, "Wrong approach");
        
        totalContract++;
    
        hashValueOfContract[trustToken] = contractToken;
    }
    
    function removeHashValueOfContract(bytes32 token) public {
        require(msg.sender == owner, "Wrong approach");
        
        totalContract--;
        delete hashValueOfContract[token];
    }
}