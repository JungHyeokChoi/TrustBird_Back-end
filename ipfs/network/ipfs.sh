#!/bin/bash

# Print the usage message
function printHelp() {
  echo "Usage: "
  echo "  ipfs.sh <mode>"
  echo "    <mode> - one of 'up', 'down', 'privateSet'"
  echo "      - 'up' - bring up the ipfs with docker-compose up"
  echo "      - 'down' - clear the ipfs with docker-compose down"
  echo "      - 'delete' - delete the folder associated with IPFS"
  echo "      - 'privateSet' - setting the IPFS private network"
}

function ipfsUp() {
    echo
    echo "===================== Create docker containers ====================="
    echo

    docker-compose -f $COMPOSE_FILE_IPFS_NODE1 -f $COMPOSE_FILE_IPFS_NODE2 -f $COMPOSE_FILE_IPFS_NODE3 up -d
    echo

    docker ps -a
    echo
    
    sleep 3
}

function ipfsDown() {
    echo
    echo "===================== Tear down running IPFS ====================="
    echo
    
    docker-compose -f $COMPOSE_FILE_IPFS_NODE1 -f $COMPOSE_FILE_IPFS_NODE2 -f $COMPOSE_FILE_IPFS_NODE3 down -v
}

function ipfsDelete() {
    echo
    echo "===================== Delete Folder ====================="
    echo
    
    NETWORK=$(docker network ls -f "name=ipfs_default" | awk 'NR == 2 {print $2}')
    if [ $NETWORK="" ]; then
      if [ -d "compose" ]; then
        sudo rm -rf compose
        echo "Delete the folder associated with IPFS"
      fi
    else
      echo "The network is still running. Please delete it after closing"
    fi
}

function privateSet() {
    NETWORK=$(docker network ls -f "name=$COMPOSE_NETWORK_NAME" | awk 'NR == 2 {print $2}')
    if [ $NETWORK="" ]; then
        ipfsUp
    fi
        
    echo
    echo "===================== IPFS Private Network Setting ====================="
    echo

    Nodes=$(docker ps --format "{{.Names}}" | grep ipfs_node | sort)
    
    # Configure IPFS API to allow CORS requests
    for node in $Nodes; do
        echo "Setting Up $node"
        docker exec $node ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
        docker exec $node ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "PUST"]'
    done


    # Generates swarm.key file for IPFS Private Network feature.
    echo "Generate swarm.key file"
    
    if [ ! -d "go-ipfs-swarm-key-gen" ]; then
        git clone https://github.com/Kubuxu/go-ipfs-swarm-key-gen
        
        cd go-ipfs-swarm-key-gen/ipfs-swarm-key-gen
        
        go build

        cd ../..
    fi

    if [ ! -e "go-ipfs-swarm-key-gen/ipfs-swarm-key-gen/swarm.key" ]; then
      cd go-ipfs-swarm-key-gen/ipfs-swarm-key-gen
      ./ipfs-swarm-key-gen > swarm.key

      cd ../..
    fi

    echo
    # Copy & Paste swarm.key file
    for node in $Nodes; do
        echo "Copy & Paste swarm.key file in $node "
        cp go-ipfs-swarm-key-gen/ipfs-swarm-key-gen/swarm.key compose/$node/data
    done

    echo
    # Remove basic bootstrap node
    for node in $Nodes; do
        echo "Remove basic bootstrap node in $node"
        docker exec $node ipfs bootstrap rm --all
        echo
    done
    
    # Setting node connetion
    for node in $Nodes; do
        echo "Setting node connetion in $node"
        IPFS_HOST_ADDRESS=$(docker exec $node ipfs id -f="<addrs>\n" | awk 'NR == 2 {print}')
        for ortherNode in $Nodes; do
            if [ "$node" != "$ortherNode" ]; then
                docker exec $ortherNode ipfs bootstrap add $IPFS_HOST_ADDRESS
            fi 
        done
        echo
    done

    # Restart docker container
    echo "Restart docker container"
    docker restart $Nodes

    echo
    # Check node connection
    for node in $Nodes; do
        echo "Check node connection in $node"
        docker exec $node ipfs swarm peers
        sleep 3
        echo
    done
}

COMPOSE_FILE_IPFS_NODE1=docker-compose-ipfs-node1.yaml
COMPOSE_FILE_IPFS_NODE2=docker-compose-ipfs-node2.yaml
COMPOSE_FILE_IPFS_NODE3=docker-compose-ipfs-node3.yaml

while getopts "h?" opt; do
  case "$opt" in
  h | \?)
    printHelp
    exit 0
    ;;
  esac
done

MODE=$1

if [ "${MODE}" == "up" ]; then # Create the ipfs using docker compose
  ipfsUp
elif [ "${MODE}" == "down" ]; then # Clear the ipfs with docker compose
  ipfsDown
elif [ "${MODE}" == "delete" ]; then # delete the folder associated with IPFS
  ipfsDelete
elif [ "${MODE}" == "privateSet" ]; then # Set IPFS private network
  privateSet
else
  printHelp
  exit 1
fi
