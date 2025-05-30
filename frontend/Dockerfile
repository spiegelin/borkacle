FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 80

ENV NODE_ENV=production
ENV PORT=80

CMD ["sh", "-c", "npm run build"] 