

data "helm_repository" "stable" {
  name = "stable"
  url  = "https://charts.helm.sh/stable"
}


resource "helm_release" "registry" {
  name = var.RELEASE_NAME
  repository = data.helm_repository.stable.metadata[0].name
  chart = "docker-registry"
  namespace = var.NAMESPACE
  values = ["${file(var.VALUES_PATH)}"]
  version = var.VERSION

}
