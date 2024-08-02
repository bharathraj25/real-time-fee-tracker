FROM node

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY .env ./

# Bundle app source
COPY . .

RUN npm i
RUN npm run generate

EXPOSE 80

# CMD [ "npm", "run", "migrate" ]
ENTRYPOINT ["npm", "run", "dev"]