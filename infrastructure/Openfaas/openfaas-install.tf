
resource "null_resource" "cluster-info" {
  provisioner "local-exec" {
    command = <<EOT
      echo "-------- Kube Cluster --------"
        kubectl config current-context
      echo "---------------------------------"
    EOT
  }
}

resource "helm_release" "openfaas" {
//  depends_on = ["kubernetes_namespace.openfaas-namespace", "kubernetes_namespace.openfaasfn-namespace"]
  name      = var.RELEASE_NAME
  chart      = "./OpenfaasCharts"
  namespace = var.NAMESPACE
  version = var.VERSION


  set {
    name = "serviceType"
    value = "ClusterIP"
  }
  set {
    name = "functionNamespace"
    value = "openfaas-fn"
  }
  set {
    name = "generateBasicAuth"
    value = false
  }
  set {
    name = "httpProbe"
    value = false
  }
  set {
    name = "faasnetes.httpProbe"
    value = false
  }

  set {
    name = "exposeServices"
    value = true
  }

  set {
    name = "securityContext"
    value = false
  }


  set {
    name = "gateway.directFunctions"
    value = true
  }


  set {
    name = "basic_auth"
    value = false
  }

  set {
    name = "prometheus.create"
    value = true
  }

  set {
    name = "istio.mtls"
    value = false
  }
  set {
    name = "faasIdler.inactivityDuration"
    value = "10m"
  }
  set {
    name = "faasIdler.dryRun"
    value = false
  }
  set {
    name = "openfaasImagePullPolicy"
    value = "IfNotPresent"
  }

}

