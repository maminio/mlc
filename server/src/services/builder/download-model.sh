#!/bin/bash

bucket="source-code"
file=$1

host='minio.minio.svc.cluster.local:9000'
#host='localhost:8000'
s3_key='kSMP5IHTKYsDY34e3m3w'
s3_secret='XdrzsC3EVShLEUaZUyEDAIh64fuXTsNHJzarGQGa'

resource="/${bucket}/${file}"
content_type="application/zip"
date=`date -R`
_signature="GET\n\n${content_type}\n${date}\n${resource}"
signature=`echo -en ${_signature} | openssl sha1 -hmac ${s3_secret} -binary | base64`
ROOT=$(pwd)


curl -v -o "${ROOT}/src/routes/inference/function/${file}" -X GET \
          -H "Host: $host" \
          -H "Date: ${date}" \
          -H "Content-Type: ${content_type}" \
          -H "Authorization: AWS ${s3_key}:${signature}" \
          http://$host${resource}
