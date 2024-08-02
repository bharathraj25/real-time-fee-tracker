# Uniswap V3 Pools Real-Time Fee Tracker

## Project Overview

### Description

#### This project helps to keep track transaction fees in USDT for all Uniswap V3 transactions from any Uniswap V3 pool.

The backend system continuously records live transaction data and processes historical batch data requests. It provides a RESTful API to start the collecting transactions job of any Uniswap V3 pool & also **(Bonus)** gets a swap exchange rate for any given transaction hash, following Swagger UI standards.

### Features

- **Real-Time Data Recording**: Continuously records live Uniswap V3 transactions from any Uniswap V3 pool.
- **Historical Data Processing**: Supports batch job requests to retrieve historical transactions to keep in sync.
- **Transaction Fee Calculation**: Calculates and stores the transaction fee in USDT for every transaction hash from Uniswap V3 pool.
- **Reliability and Scalability**: Uses BullMQ for queue management and Redis for centralized state management, ensuring reliability and scalability.
- **API Documentation**: Detailed API documentation using Swagger UI.
- **Testing**: Comprehensive test suite using Jest.
- **Dockerized**: Docker-compose setup for easy deployment and environment consistency.
- **Code Quality**: ESLint integrated to maintain code quality and formatting.

### Technologies Used

- **Node.js**: Backend server setup with Express.
- **BullMQ**: Queue management for background job processing.
- **Redis**: Centralized state management for queues.
- **PostgreSQL**: Database for storing transaction data.
- **Prisma**: As as OMR to intract with database & view records through inbuilt Prisma Studio.
- **Swagger**: API documentation.
- **Jest**: Testing framework.
- **Docker**: Containerization of the application.
- **ESLint**: Code quality and formatting.

### Third-Party Services Used

- **Etherscan**: Used for retrieving transactions from the Ethereum blockchain.
- **Moralis**: Utilized for interacting with the blockchain using Web3.js.

## Simple High-Level Architecture

The architecture of this project is designed to be scalable, reliable, and efficient for collecting and processing Uniswap V3 transaction data. Below is a high-level overview of the system:

![Arc Diagram](/arch-diagram.svg)

## Getting Started

### Prerequisites

Ensure the following are installed:

- [Docker](https://docs.docker.com/get-docker/)
- [Node.js and npm](https://nodejs.org/)
- [Git](https://git-scm.com/) (optional - but u need it if u want to contribute)
- You'll need _API keys_ for interacting with Etherscan to collect transactions but if not have one, I've included a `.env` file with my API keys for your convenience. Please use them wisely and within limits—no funny business with those keys! ! 😆

### Port Configuration

Make sure the following ports are available:

- `5555`: Exposes Prisma Studio for DB viewing.
- `3003`: Exposes the backend server.
- `5434`: Exposes PostgreSQL (optional).
- `6379`: Exposes Redis (optional).

  > Note: Ports `5434` and `6379` are optional. If you want to disable exposing these ports or use different ports, update `docker-compose.yml` accordingly.

### Installation Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/bharathraj25/tokka-labs-assignment.git
   cd tokka-labs-assignment
   ```

2. **Ensure Docker is running**

3. **Install required packages**

   - For all packages including development packages:
     ```bash
     npm install
     ```
   - For production packages only:
     ```bash
     npm install --omit=dev
     ```

4. **Run the application**
   ```bash
   npm start
   ```
   or
   ```bash
   npm run start
   ```
   **Note: This will build all Docker images and start the containers. It may take some time.**

### Collecting Transactions

Finally, to start collecting transactions of any Uniswap V3 pools, follow these steps:

1. **Visit Swagger UI**: Access the Swagger UI through the following link: [Swagger UI](http://localhost:3003/api-docs/). to interact with the API.

   -or-

2. **Load the APIs in Postman**: Use the Postman collection to interact with the API endpoints. You can import the collection using the following link: [Postman Collection](https://api.postman.com/collections/17028777-14af266d-0303-41d2-b041-e1a85d20f75d?access_key=PMAT-01J49DXBBJDVERKJFEQ9RS09Q1).

3. **Start the Job**: Use the `POST /api/job/start` API endpoint to begin collecting transactions. Provide the respective Uniswap V3 pool address in the request.

### Accessing the Application

- **Prisma Studio**: View DB records at [http://localhost:5555/](http://localhost:5555/)
- **API Documentation**: Access Swagger UI at [http://localhost:3003/api-docs/](http://localhost:3003/api-docs/)
- **Bull Board UI**: Manage jobs and view their status at [http://localhost:3001/admin/queues](http://localhost:3001/admin/queues)

**NOTE: These above links may differ according to your docker compose configurations.**

- **Optional**:
  - PostgreSQL: Running on `localhost` & port `5434`
  - Redis: Running on `localhost` & port `6379`

## Troubleshooting

- **Node.js Errors**: Refer to [Node.js Documentation](https://nodejs.org/en/docs/)
- **Docker Errors**: Refer to [Docker Documentation](https://docs.docker.com/)
- If issues persist, please raise an issue in this GitHub repository.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

## License

This project not yet licensed.

## Contact

For any questions or support, please open an issue on this repository or contact me via bharathrajgngowadara@gmail.com.
