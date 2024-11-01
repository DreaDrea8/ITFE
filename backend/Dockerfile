FROM node:20-alpine3.20 AS base
RUN echo "Base image: node:20-alpine3.20"
COPY --chown=node:node ./backend/package*.json /
WORKDIR /var/www
RUN npm i
COPY --chown=node:node ./backend .
EXPOSE 3000

# Étape 1 : Environnement de développement
FROM base AS development
RUN echo NODE_ENV: development
EXPOSE 3000 9229
CMD ["npm", "run", "start:dev"]

# Étape 2 : Environnement de build
FROM base AS build
RUN echo NODE_ENV: build
CMD ["npm", "run", "build"]

FROM node:20-alpine3.20 AS production
RUN echo NODE_ENV: production
WORKDIR /var/www
COPY --chown=node:node .env .
COPY --from=base /var/www/package*.json .  
COPY --from=build /var/www/node_modules ./node_modules
COPY --from=build /var/www/dist ./dist
CMD ["npm", "run", "start"]