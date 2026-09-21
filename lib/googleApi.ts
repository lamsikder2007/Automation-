import { GoogleDriveAsset, CalendarEventItem, ProductItem } from './types';

export async function fetchGoogleDriveFiles(accessToken: string): Promise<GoogleDriveAsset[]> {
  try {
    const res = await fetch(
      'https://www.googleapis.com/drive/v3/files?fields=files(id,name,mimeType,thumbnailLink,webViewLink,size,modifiedTime)&pageSize=30&orderBy=modifiedTime desc',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!res.ok) {
      throw new Error(`Google Drive API error: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return (data.files || []).map((f: any) => ({
      id: f.id,
      name: f.name,
      mimeType: f.mimeType,
      thumbnailLink: f.thumbnailLink,
      webViewLink: f.webViewLink,
      fileSize: f.size ? `${(parseInt(f.size) / (1024 * 1024)).toFixed(2)} MB` : undefined,
      modifiedTime: f.modifiedTime || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Failed to fetch Drive files:', error);
    throw error;
  }
}

export async function fetchGoogleSpreadsheetValues(
  accessToken: string,
  spreadsheetId: string,
  range: string = 'Sheet1!A1:Z100'
): Promise<{ headers: string[]; rows: string[][] }> {
  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
        spreadsheetId
      )}/values/${encodeURIComponent(range)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!res.ok) {
      throw new Error(`Google Sheets API error: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    const values: string[][] = data.values || [];
    if (values.length === 0) {
      return { headers: [], rows: [] };
    }
    const headers = values[0];
    const rows = values.slice(1);
    return { headers, rows };
  } catch (error) {
    console.error('Failed to fetch Spreadsheet values:', error);
    throw error;
  }
}

export async function fetchGoogleCalendarEvents(
  accessToken: string,
  timeMin?: string
): Promise<CalendarEventItem[]> {
  try {
    const now = timeMin || new Date().toISOString();
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(
        now
      )}&singleEvents=true&orderBy=startTime&maxResults=25`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!res.ok) {
      throw new Error(`Google Calendar API error: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return (data.items || []).map((item: any) => ({
      id: item.id,
      title: item.summary || 'Customer Appointment',
      description: item.description,
      startAt: item.start?.dateTime || item.start?.date || new Date().toISOString(),
      endAt: item.end?.dateTime || item.end?.date || new Date().toISOString(),
      status: item.status === 'cancelled' ? 'cancelled' : 'confirmed',
    }));
  } catch (error) {
    console.error('Failed to fetch Calendar events:', error);
    throw error;
  }
}

export async function createGoogleCalendarEvent(
  accessToken: string,
  eventData: {
    summary: string;
    description: string;
    startDateTime: string;
    endDateTime: string;
    timeZone?: string;
  }
): Promise<any> {
  try {
    const res = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: eventData.summary,
          description: eventData.description,
          start: {
            dateTime: eventData.startDateTime,
            timeZone: eventData.timeZone || 'Asia/Dhaka',
          },
          end: {
            dateTime: eventData.endDateTime,
            timeZone: eventData.timeZone || 'Asia/Dhaka',
          },
        }),
      }
    );
    if (!res.ok) {
      throw new Error(`Google Calendar create error: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Failed to create Calendar event:', error);
    throw error;
  }
}
