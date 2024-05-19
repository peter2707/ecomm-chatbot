# Chatbot Application

## Overview

This repository contains the code for a chatbot application using React for the front-end, Node.js for the back-end, Dialogflow for natural language processing, and MongoDB for data storage. The application is hosted on Vercel.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Frontend](#frontend)
  - [Development](#development)
  - [Deployment](#deployment)
- [Backend](#backend)
  - [Development](#development-1)
  - [Deployment](#deployment-1)
- [Contributing](#contributing)
- [License](#license)

## Features

- Interactive chatbot UI built with React
- Backend server implemented in Node.js
- Natural language processing with Dialogflow
- Data storage using MongoDB
- Deployment on Vercel
- Version control using GitHub

## Architecture

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB
- Vercel CLI (for deployment)
- Git

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2. Install dependencies for both frontend and backend:

    **Frontend**

    ```bash
    cd frontend
    npm install
    ```

    **Backend**

    ```bash
    cd ../backend
    npm install
    ```

3. Set up environment variables:

   Create a `.env` file in the `backend` directory with the following contents:

   ```makefile
   MONGODB_URI=your_mongodb_uri
   DIALOGFLOW_PROJECT_ID=your_dialogflow_project_id
   DIALOGFLOW_CLIENT_EMAIL=your_dialogflow_client_email
   DIALOGFLOW_PRIVATE_KEY=your_dialogflow_private_key
   ```

## Frontend
### Development
1. Start the React Development server:
   ```
   cd frontend
   npm start
   ```
2. Open your browser and navigate to http://localhost:3000.

### Deployment
1. Deploy the frontend on Vercel:
    ```
    vercel --prod
    ```
## Backend
### Development
1. Start the Node.js server:
    ```
    cd backend
    npm start
    ```
2. The server will run on http://localhost:5000.
### Deployment
1. Deploy the backend on Vercel:
    ```
    vercel --prod
    ```
## Contributing
Contributions are more than welcome! Please see CONTRIBUTING.md for more details.

## License
This project is licensed under the MIT License. See the LICENSE file for details.