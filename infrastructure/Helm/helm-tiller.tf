

resource "kubernetes_service_account" "tiller-service-account" {
  metadata {
    name = var.TILLER_SA_NAME
    namespace = var.TILLER_NAMESPACE
  }
}


resource "kubernetes_cluster_role_binding" "tiller-cluster-rolebinding" {
  metadata {
    name = var.TILLER_CLUSTER_ROLEBINDING
  }
  role_ref {
    api_group = "rbac.authorization.k8s.io"
    kind      = "ClusterRole"
    name      = "cluster-admin"
  }
  subject {
    kind      = "ServiceAccount"
    name      = var.TILLER_SA_NAME
    namespace = var.TILLER_NAMESPACE
  }

}


resource "null_resource" "delay" {
  depends_on = ["kubernetes_cluster_role_binding.tiller-cluster-rolebinding"]
  provisioner "local-exec" {
    command = "sleep 10"
  }
}


resource "null_resource" "initialize-helm" {
  depends_on = ["null_resource.delay"]
  provisioner "local-exec" {
    command = <<EOT
      echo "-------- INITIALIZING HELM --------"
        helm init --service-account tiller
      echo "---------------------------------"
    EOT
    on_failure = "continue"
  }
}


