

echo "========== Building Container ============"

MODEL=$1
ROOT=$(pwd)

# Create destination folder
mkdir -p "${ROOT}"/src/services/builder/model

#Download and build
bash "${ROOT}"/src/services/builder/download-model.sh "$MODEL"
unzip -f "${ROOT}/src/routes/inference/function/${MODEL}" -d "${ROOT}"/src/services/builder/model/

exit 0
