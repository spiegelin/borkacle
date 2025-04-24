FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

# Add non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=build --chown=appuser:appgroup /app/.next/standalone ./
COPY --from=build --chown=appuser:appgroup /app/.next/static ./.next/static
COPY --from=build --chown=appuser:appgroup /app/public ./public

USER appuser

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "server.js"] 