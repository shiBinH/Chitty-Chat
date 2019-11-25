FROM node:13
WORKDIR ~/Chitty-Chat
COPY package.json .
RUN npm install
COPY . .
RUN cd src/server && npm install
RUN cd ~/Chitty-Chat
RUN npm run-script build
CMD [ "npm", "start" ]