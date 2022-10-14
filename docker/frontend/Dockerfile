FROM node:gallium

EXPOSE 8080

WORKDIR /usr/src/app

COPY ./frontend/ .
COPY ./docker/frontend/setup.sh ./setup.sh

RUN npm install -s
RUN npm run build

ENTRYPOINT [ "bash", "setup.sh" ]

CMD [ "npm", "run", "start" ]
