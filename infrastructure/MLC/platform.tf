resource "helm_release" "mlc-platform" {
  name      = var.RELEASE_NAME
  chart      = var.PLATFORM_CHART
  namespace = var.NAMESPACE
  force_update = "true"

  values = [
    "${file(var.VALUES_PATH)}",
  ]

  set {
    name  = "ENV_NAMESPACE"
    value = var.NAMESPACE
  }

  set {
    name  = "secrets.server.jwt_secret"
    value = var.JWT_TOKEN
  }

  set {
    name  = "docker.registry"
    value = var.DOCKER_REGISTRY
  }

  set {
    name  = "MONGODB_DATABASE_NAME"
    value = var.MONGODB_DATABASE_NAME
  }

  set {
    name  = "MONGODB_DATABASE_USERNAME"
    value = var.MONGODB_DATABASE_USERNAME
  }

  set {
    name  = "MONGODB_DATABASE_PASSWORD"
    value = var.MONGODB_DATABASE_PASSWORD
  }
//  MONGODB
  set {
    name  = "mongodb.service.name"
    value = var.MONGODB_SERVICE_NAME
  }

  set {
    name  = "mongodb.name"
    value = var.MONGODB_DATABASE_NAME
  }

  set {
    name  = "mongodb.password"
    value = var.MONGODB_DATABASE_PASSWORD
  }

  set {
    name  = "mongodb.user"
    value = var.MONGODB_DATABASE_USERNAME
  }

  set {
    name = "broker.kafkaHost"
    value = var.KAFKA_HOST
  }

  set {
    name = "broker.kafkaPort"
    value = var.KAFKA_PORT
  }

  set {
    name = "broker.zookeeperHost"
    value = var.ZOOKEEPER_HOST
  }

  set {
    name = "broker.zookeeperPort"
    value = var.ZOOKEEPER_PORT
  }

  set {
    name  = "STAGING_ENDPOINT_SUBDOMAIN"
    value = var.STAGING_ENDPOINT_SUBDOMAIN
  }

  set {
    name  = "STAGING_ENDPOINT_STAGE"
    value = var.STAGING_ENDPOINT_STAGE
  }

  set {
    name  = "DOMAIN_NAME"
    value = var.DOMAIN_NAME
  }



//  ---------------------------- DOCKER CONTAINER VARIABLES ---------------
  // CLIENT
  set {
    name  = "client.deployment.image.repository"
    value = var.CLIENT_CONTAINER
  }
  set {
    name  = "client.deployment.image.tag"
    value = var.CLIENT_IMAGE_TAG
  }



  // -------------------  Provisioner -------------------
  set {
    name  = "provisioner.deployment.image.repository"
    value = var.PROVISOINER_CONTAINER
  }
  set {
    name  = "provisioner.deployment.image.tag"
    value = var.PROVISOINER_IMAGE_TAG
  }


  // Worker Provisioner
  set {
    name  = "worker.provisioner.deployment.image.repository"
    value = var.PROVISIONER_WORKER_CONTAINER
  }
  set {
    name  = "worker.provisioner.deployment.image.tag"
    value = var.PROVISIONER_WORKER_IMAGE_TAG
  }
  set {
    name  = "worker.provisioner.configmap.stage"
    value = var.PROVISIONER_WORKER_CONFIGMAP_STAGE
  }


  // Auth Service
  set {
    name  = "api.deployment.image.repository"
    value = var.API_SERVICE_CONTAINER
  }
  set {
    name  = "api.deployment.image.tag"
    value = var.API_SERVICE_IMAGE_TAG
  }
  set {
    name  = "api.configmap.stage"
    value = var.API_SERVICE_CONFIGMAP_STAGE
  }


//  OpenFaas
  set {
    name = "openfaas.host"
    value = var.OPENFAAS_HOST
  }

//  set {
//    name = "openfaas.port"
//    value = var.OPENFAAS_PORT
//  }


  set {
    name  = "secrets.redis.password"
    value = var.REDIS_PASSWORD
  }
  set {
    name = "redis.redis_host"
    value = var.REDIS_HOST
  }



//  provisioner "local-exec" {
//    command = <<EOT
//      echo "-------- updating label --------"
//        kubectl label ns ${var.NAMESPACE} istio-injection=enabled
//      echo "---------------------------------"
//    EOT
//    on_failure = "continue"
//  }

}
