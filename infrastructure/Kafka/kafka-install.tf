
data "helm_repository" "kafka" {
  name = "kafka"
  url  = "https://charts.bitnami.com/bitnami"
}


resource "helm_release" "kafka" {
  name = var.RELEASE_NAME
  repository = data.helm_repository.kafka.metadata[0].name
  chart = "kafka"
  namespace = var.NAMESPACE

  force_update = true
  set {
    name = "defaultReplicationFactor"
    value = "1"
  }


  set {
    name = "offsetsTopicReplicationFactor"
    value = "1"
  }

  set {
    name = "transactionStateLogReplicationFactor"
    value = "1"
  }

  set {
    name = "numPartitions"
    value = "1"
  }

  set {
    name = "numRecoveryThreadsPerDataDir"
    value = "1"
  }


  set {
    name = "autoCreateTopicsEnable"
    value = true
  }
  set {
    name = "zookeeper.enabled"
    value = false
  }

  set {
    name = "externalZookeeper.servers"
    value = "zookeeper.kafka.svc.cluster.local"
  }

  set {
    name = "replicaCount"
    value = 1
  }

  set {
    name = "resources.limits.cpu"
    value = "250m"
  }

  set {
    name = "resources.limits.memory"
    value = "2Gi"
  }

  set {
    name = "socketReceiveBufferBytes"
    value = 502400
  }

  set {
    name = "socketSendBufferBytes"
    value = 502400
  }

}
