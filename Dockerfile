FROM node:13
WORKDIR ~/Chitty-Chat
COPY package.json .
RUN npm install
COPY . .
RUN cd src/server && npm install
RUN cd ../..
RUN npm run-script build-prod
CMD [ "npm", "start" ]