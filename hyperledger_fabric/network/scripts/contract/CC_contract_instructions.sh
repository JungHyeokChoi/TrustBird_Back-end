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
CHAINCODE_NAME="contract"
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
# chaincodeInvoke "0 1 0 2 0 3" "addContract 0x60303AE22B998861BCE3B28F33EEC1BE758A213C86C93C076DBE9F558C11C752 Nil 대전광역시-서구-탄방동 건축물 85 거주 85 5층 85 월세 2020-10-10 2021-10-09 500 50 없음 450 40 특약사항 대전광역시-서구-탄방동 920507-XXXXXXX 홍길동 01011112222 대전광역시-서구-탄방동 920507-XXXXXXX 홍길동 01011112222 대전광역시-서구-탄방동 공인중개사이름 홍길동 111-2222-3333333 01011112222 전세계약서 http://localhost:8080/ipfs/AI2SJ2231 토지대장 http://localhost:8080/ipfs/2095SJ2231"

# sleep ${DELAY}

# # Invoke chaincode on peer0.org1 and peer0.org2 peer0.org3
# echo "Sending invoke transaction on peer0.org1 peer0.org2 peer0.org3..."
# chaincodeInvoke "0 1 0 2 0 3" "addContract 0xEE812718AA3B6B8886B7FE7FB04CEAB9DE271BCA127F4868C8769FC5F6E1AB07 Nil 대전광역시-유성구-봉명동 건축물, 98 거주 98 3층 98 전세 2020-04-08 2022-04-07 10000 1000 없음 9000 없음 특약사항 대전광역시-서구-탄방동 920507-XXXXXXX 홍길동 01011112222 대전광역시-서구-탄방동 920507-XXXXXXX 홍길동 01011112222 대전광역시-서구-탄방동 공인중개사이름 홍길동 111-2222-3333333 01011112222"

# sleep ${DELAY}

# # Invoke chaincode on peer0.org1 and peer0.org2 peer0.org3
# echo "Sending invoke transaction on peer0.org1 peer0.org2 peer0.org3..."
# chaincodeInvoke "0 1 0 2 0 3" "addContract 0xcc075E0DB800ADA34596AA56EF3E91E24A294695D5BD9A91EB23C8729DE081D2 Nil 광주광역시-서구-치평동 건축물 108 거주 108 10층 108 전세 2019-03-20 2021-03-19 8000 800 없음 7200 없음 특약사항 대전광역시-서구-탄방동 920507-XXXXXXX 홍길동 01011112222 대전광역시-서구-탄방동 920507-XXXXXXX 홍길동 01011112222 대전광역시-서구-탄방동 공인중개사이름 홍길동 111-2222-3333333 01011112222 월세계약서 http://localhost:8080/ipfs/AS20fI231"

# sleep ${DELAY}

# # Invoke chaincode on peer0.org1 and peer0.org2 peer0.org3
# echo "Sending invoke transaction on peer0.org1 peer0.org2 peer0.org3..."
# chaincodeInvoke "0 1 0 2 0 3" "addContract 0xFC3497701F497A954E1A1AAD40BE2E640BF5A4770346C70ED7D18D4171D9EF39 Nil 충청남도-공주시-웅진동 건축물 56 거주 56 7층 56 월세 2020-05-11 2021-05-10 300 30 없음 270 35 특약사항 대전광역-시서구-탄방동 920507-XXXXXXX 홍길동 01011112222 대전광역시-서구-탄방동 920507-XXXXXXX 홍길동 01011112222 대전광역시-서구-탄방동 공인중개사이름 홍길동 111-2222-3333333 01011112222"

# sleep ${DELAY}

# # Query on chaincode on peer0.org1
# echo "Querying chaincode on peer0.org1..."
# chaincodeQuery 0 1 "readContract 0x60303AE22B998861BCE3B28F33EEC1BE758A213C86C93C076DBE9F558C11C752"

# # Invoke chaincode on peer0.org1 and peer0.org2 peer0.org3
# echo "Sending invoke transaction on peer0.org1 peer0.org2 peer0.org3..."
# chaincodeInvoke "0 1 0 2 0 3" "updateContract 0x9F86D081884C7D659A2FEAA0C55AD015A3BF4F1B2B0B822CD15D6C15B0F00A08 0x60303AE22B998861BCE3B28F33EEC1BE758A213C86C93C076DBE9F558C11C752 충청남도-공주시-웅진동 건축물 56 거주 56 7층 56 월세 2020-05-11 2021-05-10 300 30 없음 270 35 특약사항 대전광역시-서구-탄방동 920507-XXXXXXX 홍길동 01011112222 대전광역시-서구-탄방동 920507-XXXXXXX 홍길동 01011112222 대전광역시-서구-탄방동 공인중개사이름 홍길동 111-2222-3333333 01011112222"

# sleep ${DELAY}

# # Query on chaincode on peer0.org2
# echo "Querying chaincode on peer0.org2..."
# chaincodeQuery 0 2 "readContract 0x9F86D081884C7D659A2FEAA0C55AD015A3BF4F1B2B0B822CD15D6C15B0F00A08"

# Invoke chaincode on peer0.org1 and peer0.org2 peer0.org3
echo "Sending invoke transaction on peer0.org1 peer0.org2 peer0.org3..."
chaincodeInvoke "0 1 0 2 0 3" "removeContract 0xc968e1f487dbd558dbfffec73a5daeb162659b9426cd472b50530c67ae74d202"

# Invoke chaincode on peer0.org1 and peer0.org2 peer0.org3
echo "Sending invoke transaction on peer0.org1 peer0.org2 peer0.org3..."
chaincodeInvoke "0 1 0 2 0 3" "removeContract 0xbf96c9d2baf0c881ea6e45c820063dfad01902b01642601bc36d513830d41af4"

# sleep ${DELAY}

# # Query on chaincode on peer0.org3
# echo "Querying chaincode on peer0.org3..."
# chaincodeQuery 0 3 "readAllContract"

echo
echo " _____   _   _   ____   "
echo "| ____| | \ | | |  _ \  "
echo "|  _|   |  \| | | | | | "
echo "| |___  | |\  | | |_| | "
echo "|_____| |_| \_| |____/  "
echo "                        "
echo

exit 0