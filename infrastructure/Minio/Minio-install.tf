

data "helm_repository" "minio" {
  name = "minio"
  url  = "https://helm.min.io"
}


resource "helm_release" "minio" {
  name = var.RELEASE_NAME
  repository = data.helm_repository.minio.metadata[0].name
  chart = "minio"
  namespace = var.NAMESPACE
  values = ["${file(var.VALUES_PATH)}"]
  version = var.VERSION

}
