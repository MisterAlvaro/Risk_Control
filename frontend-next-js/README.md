# Risk Management System

A comprehensive trading risk management and monitoring platform built with Next.js 16, TypeScript, and TanStack Query.

## Features

- **Dashboard**: Real-time overview of risk metrics, active incidents, and high-risk accounts
- **Risk Rules**: Create, edit, and manage risk monitoring rules with custom parameters
- **Incidents**: Monitor and resolve risk violations with advanced filtering
- **Accounts**: Track trading accounts with detailed risk status and history
- **Trades**: Analyze trading activity with comprehensive filtering options
- **Actions**: Manage automated actions that execute when rules are triggered

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **State Management**: TanStack Query v5
- **Form Handling**: React Hook Form
- **Date Utilities**: date-fns
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Laravel backend API running (see backend documentation)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd risk-management-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── (main)/            # Main application routes
│   │   ├── accounts/      # Accounts pages
│   │   ├── incidents/     # Incidents pages
│   │   ├── risk-rules/    # Risk rules pages
│   │   ├── trades/        # Trades pages
│   │   └── actions/       # Actions page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── layout/           # Layout components (Sidebar, MainLayout)
│   ├── dashboard/        # Dashboard widgets
│   ├── risk-rules/       # Risk rules components
│   ├── incidents/        # Incidents components
│   ├── accounts/         # Accounts components
│   ├── providers/        # Context providers
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility libraries
│   ├── api-client.ts     # API client and fetch utilities
│   ├── queries.ts        # TanStack Query hooks
│   ├── types.ts          # TypeScript type definitions
│   └── utils.ts          # Helper functions
└── hooks/                # Custom React hooks
```

## Key Features

### Risk Rules Management

- Create rules with multiple types (OPEN_TRADES_COUNT, POSITION_SIZE, DAILY_LOSS, etc.)
- Configure parameters dynamically based on rule type
- Set severity levels (hard/soft) with incident thresholds
- Attach and reorder actions with drag-and-drop
- Real-time validation and error handling

### Incident Monitoring

- Advanced filtering by status, account, rule, date range
- Quick resolution with one-click action
- Detailed violation data inspection
- Pagination and export capabilities

### Account Risk Assessment

- Visual risk level indicators (low/medium/high/critical)
- Detailed risk status breakdown by rule
- Integrated incident and trade history
- Trading status monitoring

### Data Management

- Automatic caching and revalidation with TanStack Query
- Optimistic updates for better UX
- Pagination support across all list views
- Real-time data synchronization

## API Integration

The frontend connects to a Laravel backend API. All endpoints are prefixed with `/api/v1`:

- **Risk Rules**: `/risk-rules` (CRUD + actions management)
- **Incidents**: `/incidents` (list, detail, resolve)
- **Accounts**: `/accounts` (list, detail, risk status, trades)
- **Trades**: `/trades` (list, detail)
- **Actions**: `/actions` (list)

See the API documentation for detailed endpoint specifications.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Implement proper error handling
- Use semantic HTML and ARIA attributes
- Maintain component modularity

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables
4. Deploy

### Other Platforms

Build the production bundle:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL` - Backend API base URL (required)

Note: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For issues or questions, please open an issue on GitHub or contact the development team.
