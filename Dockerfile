# Use the official Node.js 20 image as base
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files to the working directory
ADD ./package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Run the app in production mode
CMD ["npm", "start"]


# This command use for only run one service without usign compose-yaml file
# 1 - Build docker :- docker build -t radaar-docker-app .
# 2 - Check image build :- docker images or docker image ls
# 3 - Run docker image :- docker run --rm -d -p 8080:8080 --name radaar-docker-app radaar-docker-app
# 4 - Check which docker is running :- docker ps
# 5 - Stop docker :- docker stop {id}
# 6 - Binding root folder to docker :- docker run --rm -d -p 8080:8080 -v "$(pwd)":/app --name radaar-app radaar-docker-app
# 7 - Delete docker image :- docker rmi -f {id}
# 8 - if we are using redis then we need to: - docker run -it -p 6379:6379 -d --name redis-server redis:alpine