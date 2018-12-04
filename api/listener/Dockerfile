# ===========
# Build step
FROM node:alpine as builder
WORKDIR /app/build
# Create node environment
COPY package.json .
RUN npm install

# Compile index
COPY index.js .
RUN npm run build

# ===========
# Production
FROM node:alpine
WORKDIR /app/listener
COPY package.json .
RUN npm install --only=production

EXPOSE 8081

COPY --from=builder /app/build/build.js .
CMD ["node", "./build.js"]