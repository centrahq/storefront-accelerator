This is a boilerplate shop using Centra's Storefront API, built with Next.js 15.

## Getting Started

Install dependencies:

```bash
npm install
```

Create a .env file in the root of the project and add your Centra API credentials:

```env
NEXT_PUBLIC_GQL_API="API Endpoint of session Storefront API plugin"
GQL_AUTHORIZATION="Session mode token of session Storefront API plugin"
NO_SESSION_GQL_API="API Endpoint of no-session Storefront API plugin"
NO_SESSION_GQL_AUTHORIZATION="Non-session mode token of no-session Storefront API plugin"
NO_SESSION_GQL_SHARED_SECRET="Shared secret of no-session Storefront API plugin"
CENTRA_WEBHOOK_SECRET="Endpoint secret of Centra webhook plugin"
SESSION_SECRET="At least 256 bit (32 byte) secret for signing session cookies"
```

Run the development server:

```bash
npm run dev
```

If you want to run the app in a different port, you can set the `PORT` environment variable:

```bash
PORT=4000 npm run dev
```

If you want to run the app in https:

```bash
npm run dev-ssl
```

### Build for production:

Start by building the app for production:

```bash
npm run build
```

Then run the production server:

```bash
npm run start
```
