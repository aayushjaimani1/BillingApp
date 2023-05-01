FROM node:18.10

ARG WORK_DIR=/frontend
ENV PATH ${WORK_DIR}/node_modeles/.bin:$PATH

RUN mkdir ${WORK_DIR}
WORKDIR ${WORK_DIR}

COPY package.json ${WORK_DIR}
COPY package-lock.json ${WORK_DIR}

RUN npm install -g @angular/cli@15.0.4
RUN npm install -force

COPY . ${WORK_DIR}

EXPOSE 4200

CMD ng serve --host 0.0.0.0
