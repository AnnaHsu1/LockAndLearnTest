FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 19000

CMD ["npm", "run", "start"]

# docker build -t lockandlearn-app .
# docker run -it -p 19000:19000 lockandlearn-app