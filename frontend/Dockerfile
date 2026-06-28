FROM node:22-alpine
WORKDIR /app

# Copy package files first to leverage Docker's cache layer for dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your application code
COPY . .

# Vite dev server default port
EXPOSE 5173

# Run the dev server with host exposure
CMD ["npm", "run", "dev"]