# lively

An open source learning management system for the future.

[![CircleCI](https://circleci.com/gh/BioMediaLab/lively.svg?style=svg)](https://circleci.com/gh/BioMediaLab/lively)
![Docker Pulls Web](https://img.shields.io/docker/pulls/dieff07/lively_web.svg)

## About

Developed by the [BioMediaLab](http://www.biomedialab.net/).

## Development

The easiest way to contribute to Lively is by hacking on a local version of the site.
Follow the steps below to get started.

### Requirements

The following software must be installed to run a local copy of Lively.

- NodeJS (10+)
- yarn
- Docker
- docker-compose
- knew cli (`npm i -g knex`)

### Setup

To get ready to run Lively, you need to have the following services available:

- redis
- Postgresql
- S3 compatible storage

The easiest way to do this is by using the `docker-compose.yml` in the root of the repository.
Type `docker-compose up -d` to get started.

Once the database is running, you will need to create the necessary tables and seed it with sample data.
From the `/api` folder, run

`knex migrate:latest`

`knex seed:run`

The last piece you will need is a `.env` file for the api. Create the file `/api/.env` and fill it
with the necessary values (see `/api/example.env` for help).

### Running

To run the app, go to the root of the repository and run:
`yarn run dev`

The api will be available at http://localhost:3000, and the api will be at http://localhost:4000.

### Useful K8s bits

Manually update deployment to use latest image:

`kubectl set image deployments/web-node-deployment web=dieff07/lively_web:latest`

Manual account config file creation:

http://docs.shippable.com/deploy/tutorial/create-kubeconfig-for-self-hosted-kubernetes-cluster/
