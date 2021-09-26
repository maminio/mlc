#!/usr/bin/env bash

while getopts 't:l:s:' flag; do
  case "${flag}" in
    t) tag="${OPTARG}" ;;
    l) latest="${OPTARG}" ;;
    s) service_name="${OPTARG}" ;;
    *) print_usage
       exit 1 ;;
  esac
done



image_name="<UPDATE_DOCKER_ADDRESS>_${service_name}"
image_tag="$image_name:${tag}"
latest_flag=""

if [ -n "$latest" ]; then
  latest_flag=" -t ${image_name}:latest"
fi


docker build -f ./Dockerfile --build-arg NODE_ENV="development" --build-arg SERVICE_NAME="${service_name}" -t ${image_tag}${latest_flag} .
docker push "${image_name}"
