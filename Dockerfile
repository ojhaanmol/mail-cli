# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install the dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Command to run the application
CMD ["node", "index.js"]
