# lively

An open source learning management system for the future.

[![CircleCI](https://circleci.com/gh/BioMediaLab/lively.svg?style=svg)](https://circleci.com/gh/BioMediaLab/lively)

## Development

The easiest way to contribute to Lively is by hacking on a local version of the site.
Follow the steps below to get started.

### Requirements

The following software must be installed to run a local copy of Lively.

- NodeJS (10+)
- yarn
- Docker
- docker-compose

### Running

To run the app, go to the root of the repository and run:
`yarn run dev`

### Useful K8s bits

Manually update deployment to use latest image
`kubectl set image deployments/web-node-deployment web=dieff07/lively_web:latest`
Manual account config file creation
http://docs.shippable.com/deploy/tutorial/create-kubeconfig-for-self-hosted-kubernetes-cluster/
