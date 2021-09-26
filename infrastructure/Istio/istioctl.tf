
resource "kubernetes_namespace" "istio-namespace" {
  metadata {
    name = var.ISTIO_NAMESPACE
  }

  provisioner "local-exec" {
    command = <<EOT
      echo "-------- updating label --------"
        kubectl label ns default istio-injection=enabled
      echo "---------------------------------"
    EOT
    on_failure = "continue"
  }
}

resource "null_resource" "istioctl-setup" {
  provisioner "local-exec" {
    command = <<EOT
      echo "-------- ISTIOCTL --------"
        istioctl install -f IstioOperator.yaml
    EOT
  }
}


resource "null_resource" "gateway-config" {
  provisioner "local-exec" {
    command = <<EOT
      echo "-------- Gateway Config --------"
        kubectl apply -f Gateways.yaml
    EOT
  }
}

resource "null_resource" "kiali-setup" {
  provisioner "local-exec" {
    command = <<EOT
      echo "-------- Kiali Secret --------"
        kubectl create secret generic kiali -n istio-system --from-literal=username=${var.KIALI_USERNAME} --from-literal=passphrase=${var.KIALI_PASSWORD}
    EOT
  }
}
