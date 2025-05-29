import { WebClient } from '@slack/web-api';
import { google } from 'googleapis';
import JiraApi from 'jira-client';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

interface JiraIssue {
  key: string;
  fields: {
    summary: string;
    status: { name: string };
    assignee?: { displayName: string };
  };
}

interface CalendarEvent {
  summary: string | null | undefined;
  start: { dateTime: string } | null | undefined;
  end: { dateTime: string } | null | undefined;
  description?: string | null;
}

class ScrumService {
  private jira: JiraApi;
  private calendar: any;
  private slack: WebClient;

  constructor() {
    // Initialize Jira client
    this.jira = new JiraApi({
      protocol: 'https',
      host: process.env.JIRA_HOST || '',
      username: process.env.JIRA_USERNAME || '',
      password: process.env.JIRA_API_TOKEN || '',
      apiVersion: '3',
      strictSSL: true
    });

    // Initialize Google Calendar
    this.calendar = google.calendar('v3');

    // Initialize Slack client
    this.slack = new WebClient(process.env.SLACK_BOT_TOKEN);
  }

  async getJiraIssues(jql: string): Promise<JiraIssue[]> {
    try {
      const response = await this.jira.searchJira(jql, {
        fields: ['summary', 'status', 'assignee']
      });
      return response.issues;
    } catch (error) {
      console.error('Error fetching Jira issues:', error);
      throw new Error('Failed to fetch Jira issues');
    }
  }

  async getCalendarEvents(timeMin: string, timeMax: string): Promise<CalendarEvent[]> {
    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_CALENDAR_CREDENTIALS,
        scopes: ['https://www.googleapis.com/auth/calendar.readonly']
      });

      const calendar = google.calendar({ version: 'v3', auth });
      
      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: 'startTime',
      });

      return (response.data.items as CalendarEvent[]) || [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw new Error('Failed to fetch calendar events');
    }
  }

  async sendToSlack(message: string): Promise<void> {
    try {
      await this.slack.chat.postMessage({
        channel: process.env.SLACK_CHANNEL_ID || '',
        text: message,
        mrkdwn: true
      });
    } catch (error) {
      console.error('Error sending message to Slack:', error);
      throw new Error('Failed to send message to Slack');
    }
  }

  async generateScrumReport(): Promise<string> {
    try {
      // Get current date and format for Jira and Calendar
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      // 1. Get Jira issues assigned to me
      const jql = `assignee = currentUser() AND status != Done AND updated >= -1w`;
      const issues = await this.getJiraIssues(jql);

      // 2. Get today's calendar events
      const events = await this.getCalendarEvents(
        `${today}T00:00:00.000Z`,
        `${tomorrowStr}T00:00:00.000Z`
      );

      // 3. Format the report
      let report = `*📅 Daily Scrum Report - ${today}*\n\n`;
      
      // Add Jira issues
      report += '*📌 In Progress Tasks*\n';
      if (issues.length > 0) {
        issues.forEach(issue => {
          report += `• ${issue.key}: ${issue.fields.summary} (${issue.fields.status.name})\n`;
        });
      } else {
        report += 'No active tasks found.\n';
      }
      
      // Add calendar events
      report += '\n*📅 Today\'s Schedule*\n';
      if (events.length > 0) {
        events.forEach(event => {
          if (event.summary && event.start?.dateTime && event.end?.dateTime) {
            const start = new Date(event.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const end = new Date(event.end.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            report += `• ${start}-${end}: ${event.summary}\n`;
          }
        });
      } else {
        report += 'No events scheduled for today.\n';
      }

      return report;
    } catch (error) {
      console.error('Error generating scrum report:', error);
      throw new Error('Failed to generate scrum report');
    }
  }
}

export const scrumService = new ScrumService();
