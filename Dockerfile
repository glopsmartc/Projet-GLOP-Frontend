# Étape 1 : Compilation de l'application Angular
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --project projetglop-front --configuration production

# Étape 2 : Utilisation de nginx pour servir l'application
FROM nginx:alpine
COPY --from=build /app/dist/projetglop-front /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
