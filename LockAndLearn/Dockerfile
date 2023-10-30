FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 19006

CMD ["npx", "expo", "start", "--web", "--https"]
#CMD ["npm", "run", "android"] *todo on Android*
#CMD ["npm", "run", "ios"] *todo on iOS*

# Each service should have its own Dockerfile