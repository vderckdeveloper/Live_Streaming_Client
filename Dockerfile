# Step 1: Use the official Node.js image as the base image
FROM node:20.11.0-alpine

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json (if available)
COPY package.json package-lock.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of your application code
COPY . .

# Step 6: Build the Next.js application
RUN npm run build

# Step 7: Expose the port on which your Next.js app will run
EXPOSE 3000

# Step 8: Define the command to start the application
CMD ["npm", "start"]
