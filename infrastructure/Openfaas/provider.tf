provider "kubernetes" {
  version        = "~> 2.0.1"
}
provider "helm" {
  kubernetes {
    config_path = "~/.kube/config"
  }
  version        = "~> 1.2.3"
}
