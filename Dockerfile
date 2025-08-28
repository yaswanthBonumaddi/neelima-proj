FROM node:22-alpine
RUN apk add --no-cache git rsync && npm install -g pnpm @godspeedsystems/godspeed run-script-os
WORKDIR /app
COPY . .
RUN pnpm install
# RUN godspeed prisma prepare  # Uncomment if .prisma files exist
RUN pnpm run build
EXPOSE 3000
CMD ["node", "dist/index.js"]
ENV PATH=$PNPM_HOME:$PATH
ENV SHELL=/bin/sh
ENV ENV=/root/.ashrc

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY .godspeed .

# Install global packages
RUN npm install -g pnpm
RUN pnpm install -g @godspeedsystems/godspeed
RUN pnpm install -g run-script-os

# Install project dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build the application
# RUN godspeed prisma prepare     uncomment if you need to prepare Prisma
RUN godspeed build

# Expose the port the app runs on
EXPOSE 3000
# Start the application
CMD ["godspeed", "serve"]
