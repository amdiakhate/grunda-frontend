# Access key for Scaleway API
variable "access_key" {
  type      = string
  sensitive = true
}

# Secret key for Scaleway API
variable "secret_key" {
  type      = string
  sensitive = true
}

# Project ID where your infrastructure will be created
variable "project_id" {
  type = string
}

# Default region (Paris)
variable "region" {
  default = "fr-par"
}
