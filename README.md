# lab_3_Ohniev
Repository for the Programming Technologies course — Lab Work #3: Docker Compose

# Task Board with Docker Compose

## Overview
This repository contains a simple **Task Board** application built using **three Node.js microservices** and a **PostgreSQL** database.  
The **API** handles task operations, the **frontend** provides a user interface built with React, and the **logger** service records all request events.  
All containers are managed and networked together through **Docker Compose** for seamless setup and integration.

## Project structure
- **frontend/** – React-based web client that communicates with the backend API.
- **api/** – Express.js application responsible for task CRUD operations and log forwarding.
- **logger/** – Minimal microservice that writes request logs to local storage.
- **dao/** – SQL initialization script that creates the `tasks` table and inserts sample entries.
- **docker-compose.yml** – Defines and runs all services as a single multi-container setup.
- **.env.example** – Template file; copy it to `.env` and modify it to suit your configuration.

## Prerequisites
Ensure that the following tools are installed on your machine:
- **Docker** version 24 or later
- **Docker Compose plugin** version 2.24 or later

## Quick start
1. Duplicate the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` to change ports, database credentials, or logging preferences if needed.
3. Build and start all services with:
   ```bash
   docker compose up --build
   ```
4. Open the application in your browser at [http://localhost:3000](http://localhost:3000).

Docker Compose also provides access to:
- **API:** [http://localhost:5000](http://localhost:5000)
- **Logger:** accepts POST requests at `http://localhost:4000/log`
- **Database:** PostgreSQL available on `localhost:5432`

## Useful commands
- Stop running containers but keep their state:
  ```bash
  docker compose stop
  ```
- Remove all containers and networks:
  ```bash
  docker compose down
  ```
- Follow live logs from all running services:
  ```bash
  docker compose logs -f
  ```

## Troubleshooting
- **Port conflicts:** Modify port numbers in `.env`, then rebuild with `docker compose up --build`.
- **Persistent data issues:** If you need a fresh start, remove all volumes:
  ```bash
  docker compose down -v
  ```

## Development tips
- The `api`, `frontend`, and `logger` directories are mounted as volumes for real-time code updates.
- To view only API logs while debugging, run:
  ```bash
  docker compose logs -f api
  ```