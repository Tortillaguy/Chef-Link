Gemini Custom Context: Private Chef Social Platform

1. Project Overview
   This project is a social media platform designed to connect customers with private chefs. It serves two primary functions: allowing customers to hire chefs for group dinners and enabling them to subscribe to personalized meal plans. The platform aims to provide a seamless and secure experience for both chefs and customers. A key feature is the use of a blockchain-based escrow service to handle payments, ensuring trust and transparency.

2. Technology Stack
   The project is built with a modern tech stack, utilizing a monorepo structure to manage both the frontend application and the smart contract code.

Frontend:
Framework: React

Language: TypeScript

Routing: React Router (v6+)

UI Components: shadcn/ui

Styling: Tailwind CSS

Blockchain / Backend:
Language: Rust

Smart Contract Framework: ink!

Functionality: An escrow service to hold customer payments securely until the service (group dinner or meal plan) is confirmed as completed.

3. Project Structure
   The codebase is organized as a monorepo. The frontend application follows a modern, route-centric structure.

/
|-- /app # React frontend application
| |-- /components # Reusable, global UI components
| |-- /routes # Route modules, contains loaders, actions, and components
| |-- /lib # Utilities and helpers
| |-- root.tsx # The root layout component for the entire app
|-- /contracts
| |-- /escrow # The ink! smart contract code
| |-- /src
| | |-- lib.rs # Main contract logic
| |-- Cargo.toml
|-- package.json # Root package.json for monorepo scripts

4. Key Features & User Stories
   For Customers:
   As a customer, I can create a profile to browse for chefs.

As a customer, I can search and filter chefs based on cuisine, location, and availability.

As a customer, I can view a chef's profile, including their portfolio, reviews, and services offered.

As a customer, I can book a chef for a group dinner on a specific date.

As a customer, I can request a personalized meal plan from a chef.

As a customer, my payment is held in a secure escrow smart contract until I confirm the service is complete.

For Chefs:
As a chef, I can create a detailed profile showcasing my skills, experience, and menu examples.

As a chef, I can list my availability for group dinners.

As a chef, I can offer personalized meal plan services.

As a chef, I can accept or decline booking requests.

As a chef, I can receive payments securely once the service is marked as complete and funds are released from escrow.

5. Development Guidelines & Persona
   Persona: When providing assistance, act as a senior full-stack developer with expertise in both the React/TypeScript ecosystem and Rust-based blockchain development, specifically with ink!.

Code Style: Follow standard practices for TypeScript and Rust. For the frontend, adhere to the conventions established by create-react-app and shadcn/ui.

Assumptions: Assume that a user asking a question is familiar with the basics of React and Rust, but may need specific guidance on integrating the frontend with the ink! smart contract, managing state, or using React Router's route-centric patterns (loaders, actions) and shadcn/ui effectively.

Smart Contract Interaction: When discussing frontend-backend interaction, focus on how the React app would call the escrow smart contract functions (e.g., depositing funds, releasing funds, disputing a transaction).
