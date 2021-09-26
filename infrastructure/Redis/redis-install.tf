

data "helm_repository" "stable" {
  name = "stable"
  url  = "https://kubernetes-charts.storage.googleapis.com"
}

resource "kubernetes_namespace" "redis-namespace" {
  metadata {
    name = var.NAMESPACE
    labels = {
      istio-injection = "enabled"
    }
  }
}

resource "helm_release" "redis" {
  name      = var.RELEASE_NAME
  repository = data.helm_repository.stable.metadata[0].name
  chart      = "redis"
  namespace = var.NAMESPACE
  version = var.VERSION
  set {
    name = "password"
    value = var.REDIS_PASSWORD
  }

  set {
    name = "networkPolicy.allowExternal"
    value = true
  }
  set {
    name = "networkPolicy.ingressNSMatchLabels.redis"
    value = "external"
  }

  set {
    name = "networkPolicy.ingressNSPodMatchLabels"
    value = "redis-client: true"
  }

  set {
    name = "master.disableCommands"
    value = ""
  }

}

