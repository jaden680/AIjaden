# AI Services - Scrum Report Generator

This service generates daily scrum reports by fetching data from Jira and Google Calendar, then sends them to Slack.

## Features

- Fetch active tasks from Jira
- Get today's schedule from Google Calendar
- Generate formatted scrum reports
- Send reports to Slack

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Jira API access
- Google Cloud Project with Calendar API enabled
- Slack workspace with a bot token

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your credentials
4. Set up Google OAuth 2.0 credentials and download the JSON file
5. Place the Google credentials file in the project root
6. Update the `.env` file with the correct paths and tokens

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server
PORT=3000
NODE_ENV=development

# Jira Configuration
JIRA_HOST=your-domain.atlassian.net
JIRA_USERNAME=your-email@example.com
JIRA_API_TOKEN=your-jira-api-token

# Google Calendar
GOOGLE_CALENDAR_CREDENTIALS=path/to/credentials.json

# Slack
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
SLACK_CHANNEL_ID=your-channel-id
```

## API Endpoints

- `POST /scrum/generate` - Generate and send scrum report to Slack
- `GET /scrum/preview` - Preview the scrum report (doesn't send to Slack)
- `GET /health` - Health check endpoint

## Usage

1. Start the development server:
   ```bash
   npm run dev
   ```
2. To generate and send a scrum report to Slack:
   ```bash
   curl -X POST http://localhost:3000/scrum/generate
   ```
3. To preview the scrum report:
   ```bash
   curl http://localhost:3000/scrum/preview
   ```

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```

## License

MIT
