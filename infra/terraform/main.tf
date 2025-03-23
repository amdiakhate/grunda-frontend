terraform {
  required_providers {
    scaleway = {
      source  = "scaleway/scaleway"
      version = "~> 2.36"
    }
  }

  required_version = ">= 1.5.0"
}

# Provider configuration
provider "scaleway" {
  access_key = var.access_key
  secret_key = var.secret_key
  project_id = var.project_id
  region     = "fr-par"
  zone       = "fr-par-1"
}

# Create a bucket (public by default for now — ACL moved to a separate resource if needed)
resource "scaleway_object_bucket" "frontend" {
  name   = "grunda-frontend-test"
  region = "fr-par"
}

# Enable static website hosting on the bucket (using blocks instead of flat attributes)
resource "scaleway_object_bucket_website_configuration" "website" {
  bucket = scaleway_object_bucket.frontend.name
  region = "fr-par"

  index_document {
    suffix = "index.html" # Main file
  }

  error_document {
    key = "index.html"    # For single-page apps (SPA)
  }
}

# Public website URL output
output "website_url" {
  value       = "http://${scaleway_object_bucket.frontend.name}.s3.${var.region}.scw.cloud"
  description = "Public URL of the frontend static site"
}
