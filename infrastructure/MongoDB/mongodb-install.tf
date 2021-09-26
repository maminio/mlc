

data "helm_repository" "stable" {
  name = "bitnami"
  url  = "https://charts.bitnami.com/bitnami"
}

resource "helm_release" "mongodb" {
  name      = var.RELEASE_NAME
  repository = data.helm_repository.stable.metadata[0].name
  chart      = "mongodb"
  namespace = var.NAMESPACE
  version = var.VERSION


  set {
    name = "auth.username"
    value = var.MONGODB_DATABASE_USERNAME
  }

  set {
    name = "auth.password"
    value = var.MONGODB_DATABASE_PASSWORD
  }

  set {
    name = "auth.database"
    value = var.MONGODB_DATABASE_NAME
  }

  set {
    name = "auth.rootPassword"
    value = var.MONGODB_DATABASE_ROOT_PASSWORD
  }

  set {
    name = "replicaCount"
    value = 1
  }


}

