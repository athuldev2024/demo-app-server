# Use the official Node.js image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set permissions for the public directory
RUN chmod -R 755 /usr/src/app/handlebars/public


# Expose the application port
EXPOSE 3000

# Start the application with nodemon
CMD ["npm", "run", "start"]