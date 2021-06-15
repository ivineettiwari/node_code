# pull official base image
FROM node:14

# set working directory
RUN sudo mkdir -p /usr/src/app
WORKDIR /usr/src/app

# install app dependencies
COPY package.json /usr/src/app/
COPY package-lock.json ./
RUN npm install --silent

# add app
# ADD src /usr/src/app/src
# ADD public /usr/src/app/public

COPY . .
# start app
CMD ["node", "server.js"]

# c228894e5d9d