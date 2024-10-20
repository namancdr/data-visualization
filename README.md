# Data Visualization Dashboard

## Overview

This project is a data visualization dashboard built with Next.js and React. It allows users to explore and analyze data through interactive charts and graphs. The dashboard includes features such as filtering by age group and gender, as well as selecting custom date ranges for data analysis.

## Key Features

- Interactive data visualization using Recharts
- User authentication with NextAuth.js
- Responsive design using Tailwind CSS
- Custom UI components
- Date range selection
- Data filtering by age group and gender

## Technologies Used

- Next.js 13 (App Router)
- React
- TypeScript
- Tailwind CSS
- Recharts for data visualization
- NextAuth.js for authentication
- Radix UI for accessible component primitives

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/data-visualization-dashboard.git
   ```

2. Navigate to the project directory:
   ```
   cd data-visualization-dashboard
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Create a `.env.local` file in the root directory and add necessary environment variables:
   ```
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

## Running the Application

1. Start the development server:
   ```
   npm run dev
   ```

2. Open your browser and visit `http://localhost:3000`