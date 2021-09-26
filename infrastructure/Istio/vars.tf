variable "ISTIO_RELEASE_NAME" {
  default = "istio"
}


variable "ISTIO_NAMESPACE" {
  default = "istio-system"
}

variable "ISTIO_CHART_PATH" {
  default = "./IstioCharts"
}

variable "ISTIO_INIT_CHART_PATH" {
  default = "./IstioInit"
}


variable "ISTIO_VALUES_PATH" {
  default = "./values.yaml"
}
variable "ISTIO_INIT_VALUES_PATH" {
  default = "./init-values.yaml"
}

variable "ISTIO_INIT_NAME" {
  default = "istio-init"
}


variable "KIALI_USERNAME" {
  default = "admin"
}

variable "KIALI_PASSWORD" {
  default = "kiali-password"
}
