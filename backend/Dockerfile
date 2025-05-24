# Dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Copia el archivo .env al contenedor
COPY .env .env

# Compilar TypeScript
RUN npm run build

# Expone el puerto
EXPOSE 3000

CMD ["node", "dist/main"]
