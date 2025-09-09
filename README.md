# ChefLink: Private Chef Social Platform

ChefLink is a social media platform designed to connect customers with private chefs. It serves two primary functions: allowing customers to hire chefs for group dinners and enabling them to subscribe to personalized meal plans.

A key feature of the platform is the use of a blockchain-based escrow service to handle payments, ensuring trust and transparency for both chefs and customers.

## Table of Contents

- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development Guidelines](#development-guidelines)

## Key Features

### For Customers:

- **Create a Profile**: Sign up to browse for chefs.
- **Search & Filter**: Find chefs based on cuisine, location, and availability.
- **View Chef Profiles**: Look at a chef's portfolio, reviews, and services offered.
- **Book Group Dinners**: Hire a chef for a group dinner on a specific date.
- **Request Meal Plans**: Get a personalized meal plan from a chef.
- **Secure Payments**: Payments are held in a secure escrow smart contract until the service is confirmed as complete.

### For Chefs:

- **Create a Detailed Profile**: Showcase skills, experience, and menu examples.
- **Set Availability**: List availability for group dinners.
- **Offer Services**: Provide personalized meal plan services.
- **Manage Bookings**: Accept or decline booking requests.
- **Secure Payouts**: Receive payments securely once the service is marked as complete and funds are released from escrow.

## Technology Stack

The project is built with a modern tech stack, utilizing a monorepo structure to manage both the frontend application and the smart contract code.

### Frontend

- **Framework**: [React](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Routing**: [React Router](https://reactrouter.com/) (v6+)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

### Blockchain / Backend

- **Language**: [Rust](https://www.rust-lang.org/)
- **Smart Contract Framework**: [ink!](https://use.ink/)
- **Functionality**: An escrow service to hold customer payments securely until the service is confirmed as completed.

## Project Structure

The codebase is organized as a monorepo. The frontend application follows a modern, route-centric structure.

```
/
|-- /app              # React frontend application
|   |-- /components   # Reusable, global UI components
|   |-- /routes       # Route modules (loaders, actions, components)
|   |-- /lib          # Utilities and helpers
|   `-- root.tsx      # Root layout component
|-- /contracts
|   |-- /escrow       # The ink! smart contract code
|   |   |-- /src
|   |   |   `-- lib.rs # Main contract logic
|   |   `-- Cargo.toml
|-- package.json      # Root package.json for monorepo scripts
`-- README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/)
- [Rust and Cargo](https://www.rust-lang.org/tools/install)
- [cargo-contract](https://github.com/paritytech/cargo-contract)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/chef-list.git
    cd chef-list
    ```

2.  **Install frontend dependencies:**

    ```bash
    pnpm install
    ```

3.  **Build the smart contract:**
    ```bash
    cd contracts/escrow
    cargo contract build
    ```

## Development Guidelines

- **Code Style**: Follow standard practices for TypeScript and Rust. For the frontend, adhere to the conventions established by `create-react-app` and `shadcn/ui`.
- **Frontend-Backend Interaction**: The React app interacts with the escrow smart contract for depositing, releasing, and disputing funds.
