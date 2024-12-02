# Gunakan Node.js sebagai base image
FROM node:16 AS build

# Set work directory
WORKDIR /app

# Salin file package.json dan package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Salin semua file proyek
COPY . .

# Build aplikasi React
RUN npm run build

# Gunakan Apache untuk serve aplikasi React
FROM httpd:2.4

# Salin build hasil React ke folder Apache
COPY --from=build /app/build/ /usr/local/apache2/htdocs/

# Expose port 80
EXPOSE 80

# Jalankan Apache
CMD ["httpd-foreground"]
