
JWT_TOKEN = "mlc_very_secure_key"
STAGING_ENDPOINT_SUBDOMAIN = ""
STAGING_ENDPOINT_STAGE = ""
DOMAIN_NAME = "" # <UPDATE WITH YOUR OWN DEPLOYMENT URL>

DOCKER_REGISTRY = "<ADD DOCKER REGISTRY>"


// ------------------- MONGODB ---------------
MONGODB_DATABASE_NAME = "mlc-database"
MONGODB_DATABASE_USERNAME = "mlc-admin"
MONGODB_DATABASE_PASSWORD = "qwerty"
MONGODB_SERVICE_NAME = "mongo-mongodb"


// ------------- BROKER ---------------
KAFKA_HOST = "kafka-operator.kafka.svc.cluster.local"
KAFKA_PORT = "9092"
ZOOKEEPER_HOST = "zookeeper.kafka.svc.cluster.local"
ZOOKEEPER_PORT = "2181"


// ------------------- Client ------------------
CLIENT_CONTAINER = "mlc_client"
CLIENT_IMAGE_TAG = "latest"
// ---------------------------------------------
// ------------------- API Service ------------------
API_SERVICE_CONTAINER = "mlc_api"
API_SERVICE_IMAGE_TAG = "dev02"
API_SERVICE_CONFIGMAP_STAGE = "dev"
// ---------------------------------

// ------------------- WORKER Provisioner ------------
PROVISOINER_CONTAINER = "mlc_api"
PROVISOINER_IMAGE_TAG = "dev02"

OPENFAAS_HOST = "gateway.openfaas.svc.cluster.local"


// ------------------- WORKER Provisioner ------------
PROVISIONER_WORKER_CONTAINER = "mlc_worker-provisioner"
PROVISIONER_WORKER_IMAGE_TAG = "latest"
PROVISIONER_WORKER_CONFIGMAP_STAGE = "dev"


REDIS_PASSWORD = "qwerty"
REDIS_HOST = "redis-master.redis.svc.cluster.local"
