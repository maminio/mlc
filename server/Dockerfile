
ARG NODE_ENV
ARG SERVICE_NAME

FROM node:alpine
WORKDIR "/app"

##Install python
RUN apk add --no-cache bash git openssh make build-base python2 && \
    python2 -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip install --upgrade pip setuptools && \
    if [ ! -e /usr/bin/pip ]; then ln -s pip /usr/bin/pip ; fi && \
    if [[ ! -e /usr/bin/python ]]; then ln -sf /usr/bin/python2 /usr/bin/python; fi && \
    rm -r /root/.cache


WORKDIR "/app"
COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn install
COPY . .

################### ENVs ################
ENV NODE_ENV=${NODE_ENV}
ENV SERVICE_NAME=${SERVICE_NAME}
#########################################

CMD ["npm", "run", "start-prod"]
