provider "aws" {
  region = var.region
}

module "network" {
  source = "./modules/network"

  vpc_cidr = var.vpc_cidr
}

module "server" {
  source = "./modules/server"

  subnet_id = module.network.public_subnet_id
  vpc_id    = module.network.vpc_id
}