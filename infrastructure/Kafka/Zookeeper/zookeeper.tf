


resource "kubernetes_namespace" "kafka-namespace" {
  metadata {
    name = var.ZK_NAMESPACE
    labels = {
      istio-injection = "enabled"
    }
  }
}


resource "helm_release" "zookeeper_install" {
  name      = var.ZK_RELEASE_NAME
  chart      = var.PLATFORM_CHART
  namespace = var.ZK_NAMESPACE
}
