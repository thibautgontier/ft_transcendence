FROM node:gallium

EXPOSE 3000

WORKDIR /usr/src/app

COPY ./backend/ .
COPY ./docker/backend/setup.sh ./setup.sh

RUN npm install -s
RUN npm update

ENTRYPOINT [ "bash", "setup.sh" ]

CMD [ "npm", "run", "start" ]
