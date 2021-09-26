variable "RELEASE_NAME" {
  default = "mlc"
}

variable "NAMESPACE" {
  default = "default"
}


variable "VALUES_PATH" {
  default = "./MLC_Platform/values.yaml"
}

variable "PLATFORM_CHART" {
  default = "./MLC_Platform"
}

variable "JWT_TOKEN" {}

variable "DOCKER_REGISTRY" {}


variable "MONGODB_DATABASE_NAME" {}
variable "MONGODB_DATABASE_USERNAME" {}
variable "MONGODB_DATABASE_PASSWORD" {}
variable "MONGODB_SERVICE_NAME" {}



variable "KAFKA_HOST" {}
variable "KAFKA_PORT" {}
variable "ZOOKEEPER_HOST" {}
variable "ZOOKEEPER_PORT" {}

variable "STAGING_ENDPOINT_SUBDOMAIN" {}
variable "STAGING_ENDPOINT_STAGE" {}
variable "DOMAIN_NAME" {}

variable "CLIENT_CONTAINER" {}
variable "CLIENT_IMAGE_TAG" {}

// API Service
variable "API_SERVICE_CONTAINER" {}
variable "API_SERVICE_IMAGE_TAG" {}
variable "API_SERVICE_CONFIGMAP_STAGE" {}


variable "PROVISOINER_IMAGE_TAG" {}
variable "PROVISOINER_CONTAINER" {}

variable "OPENFAAS_HOST" {}
variable "OPENFAAS_PORT" {
  default = "8080"
}


// WORKER Provisioner
variable "PROVISIONER_WORKER_CONTAINER" {}
variable "PROVISIONER_WORKER_IMAGE_TAG" {}
variable "PROVISIONER_WORKER_CONFIGMAP_STAGE" {}

variable "REDIS_PASSWORD" {}
variable "REDIS_HOST" {}
