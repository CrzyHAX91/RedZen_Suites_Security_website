import { Inquiry } from './types';

/**
 * Creates a new inquiry JSON file in the user's Google Drive.
 */
export async function createInquiryFile(accessToken: string, inquiry: Inquiry): Promise<string> {
  const fileName = `redzen_inquiry_${Date.now()}_${inquiry.suiteId}.json`;
  
  // Set up the metadata and content
  const metadata = {
    name: fileName,
    mimeType: 'application/json',
    description: `RedZen Suites Inquiry for ${inquiry.suiteName} requested by ${inquiry.name}`,
    properties: {
      app: 'RedZenSuites',
      suiteId: inquiry.suiteId,
      inquiryDate: inquiry.createdAt
    }
  };

  const boundary = 'redzen_suites_boundary_multipart';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const bodyContent = JSON.stringify(inquiry);

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    bodyContent +
    closeDelimiter;

  const url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Google Drive Upload Error:', errorText);
    throw new Error(`Failed to save inquiry to Google Drive: ${response.statusText}`);
  }

  const fileData = await response.json();
  return fileData.id;
}

/**
 * Lists all redzen inquiry files in the user's Google Drive and reads their content.
 */
export async function listInquiryFiles(accessToken: string): Promise<Inquiry[]> {
  // 1. Search for files matching our naming pattern
  const query = encodeURIComponent("name contains 'redzen_inquiry_' and name ends with '.json' and trashed = false");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,createdTime)&orderBy=createdTime desc`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Google Drive List Error:', errorText);
    throw new Error(`Failed to list inquiries from Google Drive: ${response.statusText}`);
  }

  const data = await response.json();
  const files = data.files || [];

  // 2. Fetch content for each file in parallel
  const inquiries: Inquiry[] = [];
  
  const fetchPromises = files.map(async (file: any) => {
    try {
      const fileUrl = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;
      const fileRes = await fetch(fileUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });

      if (fileRes.ok) {
        const inquiryContent: Inquiry = await fileRes.json();
        // Attach the Google Drive file ID
        inquiryContent.id = file.id;
        return inquiryContent;
      }
    } catch (e) {
      console.error(`Error downloading file content for ${file.id}:`, e);
    }
    return null;
  });

  const resolved = await Promise.all(fetchPromises);
  for (const inquiry of resolved) {
    if (inquiry) {
      inquiries.push(inquiry);
    }
  }

  return inquiries;
}

/**
 * Deletes an inquiry file from Google Drive (with verification at the UI level).
 */
export async function deleteInquiryFile(accessToken: string, fileId: string): Promise<void> {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;
  
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Google Drive Delete Error:', errorText);
    throw new Error(`Failed to delete inquiry from Google Drive: ${response.statusText}`);
  }
}
