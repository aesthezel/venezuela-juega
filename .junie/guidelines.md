# Venezuela Juega - Development Guidelines

This document provides guidelines and information for developers working on the Venezuela Juega project.

## Project Overview

Venezuela Juega is a web application that catalogs video games developed in Venezuela. The application is built with:

- **Preact**: A lightweight alternative to React
- **TypeScript**: For type safety
- **Vite**: For fast development and building
- **Tailwind CSS**: For styling (loaded via CDN)

The application fetches game data from a Google Spreadsheet and provides features like filtering, searching, and different views (catalog, calendar, charts).

## Build and Configuration

### Prerequisites

- Node.js (v16+)
- npm (v7+)

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server:

```bash
npm run dev
```

This will start a development server at `http://localhost:5173/` with hot module replacement.

### Building for Production

To build the application for production:

```bash
npm run build
```

This will generate optimized assets in the `dist` directory.

To preview the production build locally:

```bash
npm run preview
```

## Testing

The project uses Vitest for testing, along with Testing Library for Preact.

### Running Tests

To run tests once:

```bash
npm test
```

To run tests in watch mode (useful during development):

```bash
npm run test:watch
```

### Adding New Tests

Tests are located in the `test` directory, mirroring the structure of the source code. For example, tests for components in the `components` directory are in `test/components`.

To add a new test:

1. Create a new file with the `.test.tsx` extension in the appropriate directory
2. Import the component and testing utilities
3. Write your tests using the Vitest and Testing Library APIs

Example test file:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/preact';
import YourComponent from '../../components/YourComponent';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent prop1="value1" />);
    expect(screen.getByText('Expected Text')).toBeDefined();
  });
});
```

## Project Structure

- `components/`: UI components
  - `icons/`: Icon components
  - `pages/`: Page components
- `dist/`: Build output (generated)
- `test/`: Test files
- `App.tsx`: Main application component
- `index.tsx`: Application entry point
- `types.ts`: TypeScript type definitions
- `vite.config.ts`: Vite configuration
- `vitest.config.ts`: Vitest configuration

## Data Structure

The application uses the following main data types:

- `Game`: Represents a video game with properties like title, platform, genre, etc.
- `GameStatus`: Enum representing the status of a game (released, in development, etc.)
- `Page`: Type representing the different pages in the application

## Code Style and Conventions

Based on the existing codebase, follow these conventions:

### TypeScript

- Use TypeScript for all new code
- Define interfaces for component props
- Use enums for fixed sets of values
- Use type annotations for function parameters and return types

### Components

- Use functional components with hooks
- Define prop interfaces at the top of the file
- Use destructuring for props
- Export components as default exports

### Styling

- Use Tailwind CSS classes for styling
- Follow the existing pattern of using utility classes directly in the JSX
- Use consistent spacing and indentation

### State Management

- Use React hooks for state management (useState, useEffect, useMemo)
- Keep state as close to where it's used as possible
- Use callbacks for state updates that depend on previous state

## External Dependencies

The application uses several external libraries loaded via CDN:

- Tailwind CSS: For styling
- Chart.js: For charts
- FullCalendar: For the calendar view
- Bootstrap Icons: For icons

These are loaded in the `index.html` file and don't need to be installed via npm.

## Data Source

The application fetches game data from a Google Spreadsheet using Papa Parse. The URL is hardcoded in the `App.tsx` file:

```
https://docs.google.com/spreadsheets/d/1tVBCGdGaTSTTikMKWFVT4Lzmq71TRikWSzIjiIR15FA/pub?gid=0&single=true&output=csv
```

If you need to change the data source, update this URL in the `App.tsx` file.