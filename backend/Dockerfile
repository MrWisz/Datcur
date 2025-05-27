FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build || { echo "BUILD FALLÓ"; ls -l /app; exit 1; }
RUN echo "CONTENIDO DIST:" && ls -l /app/dist

EXPOSE 3000

CMD ["node", "--max-old-space-size=512", "dist/main"]
