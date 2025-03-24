terraform {
  required_providers {
    scaleway = {
      source  = "scaleway/scaleway"
      version = "~> 2.36"
    }
  }
  required_version = ">= 1.5.0"
}

variable "vite_api_url" {
  description = "The URL of the API to be used by the Vite application"
  type        = string
}

provider "scaleway" {
  access_key = var.access_key
  secret_key = var.secret_key
  project_id = var.project_id
  region     = "fr-par"
}

locals {
  buckets = {
    preview = "app-preview.grunda.io"
    prod    = "app.grunda.io"
  }
}

# Create a bucket for each environment
resource "scaleway_object_bucket" "frontend" {
  for_each = local.buckets

  name   = each.value
  region = "fr-par"
}

# Enable static website hosting
resource "scaleway_object_bucket_website_configuration" "website" {
  for_each = local.buckets

  bucket = scaleway_object_bucket.frontend[each.key].name
  region = "fr-par"

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html" # for SPA fallback
  }
}

# Outputs
output "bucket_domains" {
  value = {
    for env, domain in local.buckets :
    env => "http://${domain}.s3-website.fr-par.scw.cloud"
  }
  description = "S3 static website endpoints for preview and production"
}

output "vite_api_url" {
  value = var.vite_api_url
  description = "The API URL configured for the Vite application"
}
