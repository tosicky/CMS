#!/bin/bash

sudo yum update -y
sudo yum install -y amazon-linux-extras docker
sudo systemctl start docker
sudo usermod -a -G docker ec2-user

# Install amazon ECR
sudo yum install amazon-ecr-credential-helper

mkdir .docker

cat << EOF > ~/.docker/config.json
{
	"credsStore": "ecr-login"
}
EOF

# sudo docker run tosicky/allhandsdev:cms-app-v1
