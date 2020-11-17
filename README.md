# Project : Trust  Bird(Back-end)



## 1. What is Trust Bird?

- Trust Bird is a trust contract platform for lessee.

  

- Architecture

  ![_Real estate transaction Architecture(ver_hyperledger)](https://user-images.githubusercontent.com/65533287/99356460-89408800-28ed-11eb-8520-49c6db65bed3.jpg)

## 2. Get Start

### * Pre-Setting

- Ubuntu
- Docker
- Node.js(ver 12.x)
- Go
- npm



### a. npm install

```
npm install || npm i
npm install -g truffle@5.0.19 || npm i -g truffle@5.0.19
```



### b. Hyperledger Fabric

#### - Chaincode Complie 

```
cd hyperledger_fabric/chaincode/user
go build

cd ../trust
go build

cd ../contract
go build

cd ../maintenanceFee
go build
```



#### - Network Up

```
cd ../../network
./network.sh up
```



#### - Chaincode Install & Instantiate

```
cd script
./CC.sh
```



#### - Blockchain Explorer Up

```
cd ..
./network.sh explorerUp
```

**<u><span style="color:red">Caution : Blockchain Explorer doesn't work before chaincode install & instantiate</u>** </span>



#### - Create Wallet

```
cd ../application
node enrollAdmin.js
node registerUser.js
```



### C. IPFS

#### - Private Network Up

```
cd ../../ipfs/network
./ipfs.sh privateSet
```



### D. Ethereum(ganache-cli)

```
cd ../../ethrerum
docker-compose -f docker-compose-ganache-cli.yaml up -d
truffle migrate
```

**Copy & paste (path : TrustBird_Back-end/router/ethereum/ethereumTx.js)**

![2캡처](https://user-images.githubusercontent.com/65533287/99360124-78931080-28f3-11eb-8cbf-a51dba8e25f8.PNG)



### F. Clean Up

```
cd hyperledger_fabric/network
./network.sh down
```

