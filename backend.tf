terraform {
  backend "s3" {
    bucket = "mohamed-terraform-state-2026"
    key    = "devops/terraform.tfstate"
    region = "us-east-1"
  }
}