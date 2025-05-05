FROM node:18.20.2-alpine

# Necesario para compilar bcrypt desde source
RUN apk add --no-cache python3 make g++ 

WORKDIR /src

COPY package*.json ./


RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "run", "dev"]