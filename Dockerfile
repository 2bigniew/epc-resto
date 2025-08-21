FROM node:22.12.0

# Set the working directory inside the container
WORKDIR /service/app

# Copy everything from the project root into /service/app
COPY . .

# Remove any existing node_modules and dist folder
RUN rm -rf node_modules
RUN rm -rf dist

# Fix permissions for the node user
RUN chown -R node:node /service

# Expose the port your app will run on
EXPOSE 3000

# Switch to non-root user
USER node

## Install dependencies
RUN npm install

# Start the app in watch mode
#CMD ["npx", "@nestjs/cli", "start", "--watch"]

CMD ["npm", "run", "start:dev"]

