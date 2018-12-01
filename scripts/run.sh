#!/bin/bash
set -e

SCRIPT_FOLDER="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ANSIBLE_FOLDER="${SCRIPT_FOLDER}/../../digitalpanda-infrastructure/ansible"

trap stop_containers INT

function stop_containers() {
    echo "Stopping containers"
    sudo docker stop $(sudo docker ps -q  -f name=cassandra -f name=digitalpanda-backend)  || true
}

if [ $# -gt 0 ] && [ $1 = "-b" ];then
    stop_containers
    cd ${ANSIBLE_FOLDER}
    echo "Deploy backend stack with Ansible"
    ansible-playbook digitalpanda-stack.yml --inventory-file=digitalpanda-inventory-local --extra-vars "clear_state=true inject_test_data=true"
    sudo docker ps
    cd -
fi

sleep 5
echo "Contacting backend REST API"
curl -v http://localhost:8080/greeting

echo "Build and serve frontend"
npm run start
