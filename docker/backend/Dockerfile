FROM node:16.15

EXPOSE 3000

COPY ./backend /backend
COPY ./docker/backend/setup.sh /setup.sh

ENTRYPOINT [ "bash", "setup.sh" ]

# CMD [ "npm", "install", ";", "npm", "run" ]
CMD [ "npm", "run", "start" ]
