

echo "========== Building Container ============"

DESTINATION=$1
MODEL=$2
ROOT=$(pwd)

# Create destination folder
mkdir -p "${ROOT}"/src/services/builder/model

#Download and build
bash "${ROOT}"/src/services/builder/download-model.sh "$MODEL"
unzip "${ROOT}/src/routes/inference/function/${MODEL}" -d "${ROOT}"/src/services/builder/model/
sudo /home/default/kaniko/executor --single-snapshot --destination "$DESTINATION" --dockerfile temp-dockerfile --context /home/default

# Delete downloaded file
rm -rf "${ROOT}"/src/routes/inference/function/"${MODEL}" "${ROOT}"/src/services/builder/model

exit 0
