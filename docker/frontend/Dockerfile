FROM node:16.15

EXPOSE 8080

COPY ./frontend /frontend
COPY ./docker/frontend/setup.sh /setup.sh

ENTRYPOINT [ "bash", "setup.sh" ]

# CMD [ "npm", "install", ";", "npm", "run", "dev" ]
CMD [ "npm", "run", "start" ]
