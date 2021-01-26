#!/bin/bash
echo
echo " ____    _____      _      ____    _____ "
echo "/ ___|  |_   _|    / \    |  _ \  |_   _|"
echo "\___ \    | |     / _ \   | |_) |   | |  "
echo " ___) |   | |    / ___ \  |  _ <    | |  "
echo "|____/    |_|   /_/   \_\ |_| \_\   |_|  "
echo "                                         "
echo

CHANNEL_NAME="mychannel"
CHAINCODE_NAME="user"
VERSION="$1"
: ${VERSION:="v1.0.0"}
DELAY="3"
TIMEOUT="10"
COUNTER=1
MAX_RETRY=10
CC_SRC_PATH="github.com/chaincode/${CHAINCODE_NAME}"

# Import shell script
. scripts/utils.sh

echo
echo "===================== Chaincode Instructions ====================="
echo

# # Invoke chaincode on peer0.org1 and peer0.org2 peer0.org3
# echo "Sending invoke transaction on peer0.org1 peer0.org2 peer0.org3..."
# chaincodeInvoke "0 3 0 2 0 1" "addUser Choi page1114@gmail.com qwer1234!@ 1992-10-11 man 01093104267 User 0 0"

# sleep ${DELAY}

# # Query on chaincode on peer0.org1
# echo "Querying chaincode on peer0.org1..."
# chaincodeQuery 0 1 "readUser page1114@gmail.com"

# # Invoke chaincode on peer0.org1 and peer0.org2 peer0.org3
# echo "Sending invoke transaction on peer0.org1 peer0.org2 peer0.org3..."
# chaincodeInvoke "0 3 0 2 0 1" "updateUser Park page1114@gmail.com qwer1234 1992-2-22 woman 01020022002 Admin 1 0"

# sleep ${DELAY}

# # Query on chaincode on peer0.org1
# echo "Querying chaincode on peer0.org1..."
# chaincodeQuery 0 1 "readUser page1114@gmail.com"

# # Invoke chaincode on peer0.org1 and peer0.org2 peer0.org3
# echo "Sending invoke transaction on peer0.org1 peer0.org2 peer0.org3..."
# chaincodeInvoke "0 3 0 2 0 1" "removeUser page1111@naver.com"

# chaincodeInvoke "0 3 0 2 0 1" "addAttribute page1114@gmail.com Trust 0x123456789"
# sleep ${DELAY}

# chaincodeQuery 0 1 "readUser page1114@gmail.com"

# chaincodeInvoke "0 3 0 2 0 1" "addAttribute page1114@gmail.com MaintenanceFee 10101010"
# sleep ${DELAY}

# chaincodeQuery 0 1 "readAttribute page1114@gmail.com MaintenanceFee"
# sleep ${DELAY}

# chaincodeInvoke "0 3 0 2 0 1" "updateAttribute page1114@gmail.com MaintenanceFee 10101010 20202020"
# sleep ${DELAY}

# chaincodeQuery 0 1 "readAttribute page1114@gmail.com MaintenanceFee"
# sleep ${DELAY}

# chaincodeInvoke "0 3 0 2 0 1" "removeAttribute page1114@gmail.com MaintenanceFee 20202020"
# sleep ${DELAY}

# chaincodeQuery 0 1 "readUser page1114@gmail.com"

echo
echo " _____   _   _   ____   "
echo "| ____| | \ | | |  _ \  "
echo "|  _|   |  \| | | | | | "
echo "| |___  | |\  | | |_| | "
echo "|_____| |_| \_| |____/  "
echo "                        "
echo

exit 0