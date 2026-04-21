# Full-Stack Invoice App

A modern, responsive web application for creating and managing invoices. Built with React, TypeScript, and Vite, this application features a beautiful UI, Euro currency formatting, and seamless invoice creation workflows and navigation.

## Features

- **Invoice Management:** Create, view, and manage invoices with ease.
- **Modern UI/UX:** Responsive design featuring a sidebar navigation, landing page illustrations, and polished layouts.
- **Euro Currency Formatting:** Consistent formatting across the application tailored for Euro transactions.
- **Responsive Design:** Fully functional across desktop, tablet, and mobile devices.

## Tech Stack

- **Frontend Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v7
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm, yarn, or pnpm

### Installation

1. Clone the repository (if applicable):
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd invoice
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The app will be accessible at `http://localhost:5173`.

### Building for Production

To create a production-ready build:

```bash
npm run build
```

The compiled assets will be output to the `dist` directory.

## Project Structure

```text
invoice/
├── public/           # Public assets
├── src/
│   ├── assets/       # Static assets, images, and illustrations
│   ├── components/   # Reusable UI components (e.g., InvoiceForm)
│   ├── context/      # React Context providers for global state
│   ├── hooks/        # Custom React hooks (e.g., useTheme)
│   ├── pages/        # Main application views and routes (e.g., InvoiceList, InvoiceDetail)
│   ├── types.ts      # Global TypeScript definitions & interfaces
│   ├── App.tsx       # Main application layout and routing setup
│   └── main.tsx      # Application entry point
├── package.json      # Dependencies and scripts
└── vite.config.ts    # Vite configuration
```

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Compiles TypeScript and builds the application for production.
- `npm run lint`: Runs ESLint to check for code quality and formatting.
- `npm run preview`: Previews the production build locally.
