

MODEL_PATH=$1


conda run -n inference /bin/bash -c "pip install numpy"
conda run -n inference /bin/bash -c "pip install -r ""$MODEL_PATH"""
