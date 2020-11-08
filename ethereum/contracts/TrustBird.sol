pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract TrustBird {
    mapping(string => string[]) private hashValueOfTrust;
    mapping(string => string) private hashValueOfContract;
    
    address private owner;
    
    uint16 maxValue;
    
    uint32 public totalTrust;
    uint32 public totalContract;
    
    constructor() public {
        owner = msg.sender;
        maxValue = 65535;
    }

    function getHashValueOfTrust(string memory email) public view returns(string[] memory) {
        return hashValueOfTrust[email];
    }
    
    function addHashValueOfTrust(string memory email, string memory token, uint16 index) public {
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
    
    function getHashValueOfContract(string memory token) public view returns(string memory) {
        return hashValueOfContract[token];
    }

    function addHashValueOfContract(string memory trustToken, string memory contractToken) public {
        require(msg.sender == owner, "Wrong approach");
        
        totalContract++;
    
        hashValueOfContract[trustToken] = contractToken;
    }
    
    function removeHashValueOfContract(string memory trustToken) public {
        require(msg.sender == owner, "Wrong approach");
        
        totalContract--;
        delete hashValueOfContract[token];
    }
}