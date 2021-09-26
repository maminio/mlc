variable "TILLER_SA_NAME" {
  default = "tiller"
}


variable "TILLER_NAMESPACE" {
  default = "kube-system"
}

variable "TILLER_CLUSTER_ROLEBINDING" {
  default = "tiller"
}
