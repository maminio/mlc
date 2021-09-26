
variable "ZK_RELEASE_NAME" {
  default = "zookeeper"
}


variable "ZK_NAMESPACE" {
  default = "kafka"
}

variable "ZK_VERSION" {
  default = "0.0.2"
}

variable "PLATFORM_CHART" {
  default = "./ZookeeperCharts"
}
