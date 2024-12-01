# AutoRiaClone - Car Selling Platform

## Project Overview

**AutoRiaClone** is a NestJS-based clone of a car selling platform inspired by AutoRia. This project aims to build a flexible, scalable platform to accommodate a rapidly growing customer base and provide a modern user experience while integrating AWS services for scalability and flexibility.

The platform is designed for multiple roles, account types, and allows the creation of car listings with various features, such as multiple currencies, premium user perks, and real-time data updates. The architecture is designed to handle permissions and future extensions like car dealerships with dedicated management teams.

## Features

### 1. User Roles
AutoRiaClone supports four main roles:

## User Roles

The following user roles are defined in the `UserRoleEnum` to manage permissions and access levels:

- **Buyer**: A user who browses the platform, contacts sellers or car dealerships for inquiries, schedules test drives, etc.
- **Seller**: A user who creates car listings to sell vehicles.
- **Manager**: Responsible for managing platform activities like banning users, removing invalid listings, and checking suspicious activity. Managers can only be created by an Administrator.
- **Admin**: The superuser with full control over the platform. This role is only for the platform owner and their partners.
- **Mechanic**: A user responsible for performing vehicle inspections, providing condition reports, or conducting mechanical work as part of the platform’s services.
- **Dealership Admin**: A user who oversees dealership operations, including managing listings, employees, and dealership-related activities.
- **Dealership Manager**: A manager responsible for supervising dealership employees, reviewing inventory, and ensuring smooth operations within the dealership.
- **Dealership Seller**: A user who creates and manages vehicle listings on behalf of the dealership.
- **Dealership Mechanic**: A mechanic working under a dealership, responsible for maintaining and repairing vehicles within the dealership's inventory.

> **Note:** Future plans include support for car dealerships with their own managers, administrators, sales teams, and mechanics. The platform's permission system is designed to support these extensions.

### 2. Account Types
There are two account types:

- **Basic Account**: By default, all sellers have a basic account. Sellers with basic accounts can only list one car for sale.
- **Premium Account**: Premium accounts are purchased, allowing sellers to view listing statistics, such as average market price and view count, and list unlimited cars.

### 3. Platform Capabilities
- **Create Car Listings**: Registered sellers can list their cars for sale. Sellers with a basic account can post only one car, while premium sellers can post an unlimited number of listings.
    - Car make and model selection is done via a dropdown. If a make or model is missing, sellers can report this to the admin.
    - Pricing is available in three currencies (USD, EUR, UAH), with conversion rates updated daily from PrivatBank. Users must specify one currency when creating a listing, and the system calculates the price in other currencies based on the daily exchange rate.
    - Listings are automatically checked for inappropriate language. If detected, the seller is prompted to edit the listing up to 3 times. If the issue persists, the listing is marked as inactive and a manager is notified.

### 4. Listing Information
- **Basic Account Sellers**: Sellers with basic accounts do not have access to detailed statistics.
- **Premium Account Sellers**: Sellers with premium accounts can access the following data:
    - Number of views for each listing
    - Daily, weekly, and monthly view counts
    - Average market price for the listed car in the region
    - Average market price for the listed car across Ukraine

## 5. AWS Integration
The platform is designed to be AWS-ready, providing scalability and flexibility in infrastructure, storage, and service management. AWS will enable handling high traffic volumes and provide robust service support for scaling user and listing numbers.

## Prerequisites

## Hardware Requirements

1. **Processor**: Quad-core processor with support for 64-bit architecture.

2. **Random Access Memory (RAM)**: A minimum of 8 GB of RAM is recommended.

3. **Free Disk Space**: At least 10 GB of free space is required to store the project and its dependencies.

## Operating System Requirements

The CRM Programming School project is compatible with various operating systems. However, the most common operating systems for development are as follows:

1. **Windows**: Windows 10 or later.

2. **macOS**: macOS version 10.12 Sierra or later.

3. **Linux**: Most Linux distributions are supported, including Ubuntu, Fedora, Debian, CentOS, and more.

## Software Installation

To run the project, you need to install the following tools on your computer:

- [Node.js](https://nodejs.org/) (version 16+ recommended)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/) (or any other supported database)
- [Docker](https://www.docker.com/) 
- [Docker Compose](https://docs.docker.com/compose/).

## Project Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/VrublevskiyVolodymyr/autoRiaClone.git
2. Navigate to the project directory:
   ```bash
   cd autoRiaClone
3. Set up your environment variables:
   Rename .env.example to ./environments/local.env
   Configure the necessary environment variables (AWS keys, database credentials, etc.)
   Replace the following values in the ./environments/local.env file with valid ones:
   SMTP_EMAIL="manager@gmail.com"
   MANAGER_EMAIL="manager@gmail.com"
   SMTP_PASSWORD="manager_smtp_password""
4. Start the Docker container with the environment settings and the application:
    ```bash
   docker compose up
5. Navigate to the MinIO console at http://localhost:9001/login.
Log in using the credentials specified in your .env file (MINIO_ROOT_USER and MINIO_ROOT_PASSWORD).
Create a bucket with the name specified in your .env file for AWS_S3_BUCKET_NAME (e.g., auto-ria-clone-2024).
6. Access the application:
   The application should now be running at http://localhost:3001.
7. Documentation is available at [http://localhost:3001/docs](http://localhost:3001/docs).

### Future Plans
Support for car dealerships with internal teams (managers, administrators, mechanics, sales personnel)
Enhanced statistics and analytics for premium users
Integration with third-party car listing services


### Contributing
Contributions are welcome! If you'd like to contribute to this project, please fork the repository and submit a pull request.

### License
This project is licensed under the MIT License. See the LICENSE file for details.

