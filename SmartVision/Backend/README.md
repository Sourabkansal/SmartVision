# Backend Setup

## Environment Configuration

This backend requires Zoho CRM API credentials to function properly. Follow these steps to set up your environment:

### 1. Create Environment File

Copy the `env.example` file to `.env`:

```bash
cp env.example .env
```

### 2. Environment Variables

The following environment variables are required:

- `ZOHO_TOKEN_URL`: Zoho OAuth token endpoint
- `ZOHO_CLIENT_ID`: Your Zoho application client ID
- `ZOHO_CLIENT_SECRET`: Your Zoho application client secret
- `ZOHO_REDIRECT_URI`: Your application's redirect URI
- `ZOHO_REFRESH_TOKEN`: Your Zoho refresh token for API access

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Server

```bash
npm start
```

## Security Notes

- Never commit the `.env` file to version control
- Keep your Zoho credentials secure
- The `.env` file is already included in `.gitignore`

## API Endpoints

- `GET /`: Health check endpoint
- Additional endpoints will be added as needed for Zoho CRM integration 