const https = require('https');

const SYSTEM_PROMPT = `You are a plain-English medical billing assistant for everyday patients, Medicare enrollees, and family caregivers.

When given a medical bill or EOB (Explanation of Benefits):
1. Summarize what was billed in plain English
2. Explain what insurance paid and why
3. State clearly what the patient owes and why
4. Flag amounts, codes, or patterns that commonly indicate billing errors
5. Give 1-2 sentences of "what to do next" guidance

Use clear section headers. Short sentences. No jargon — define any term you must use.
Write as if explaining to a 68-year-old who just got home from the hospital, confused and stressed.
Do not give legal or medical advice. You are translating documents only.`;

function makeHttpRequest(method, host, path, headers, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: host,
      path: path,
      method: method,
      headers: headers,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ status: res.statusCode, data });
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (body) {
      req.write(body);
    }
    req.end();
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { content, type } = JSON.parse(event.body);

    if (!content) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No content provided' }),
      };
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY environment variable not set');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API key not configured' }),
      };
    }

    const requestBody = JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: Array.isArray(content) ? content : [{ type: 'text', text: content }],
        },
      ],
    });

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Length': Buffer.byteLength(requestBody),
    };

    const response = await makeHttpRequest(
      'POST',
      'api.anthropic.com',
      '/v1/messages',
      headers,
      requestBody
    );

    if (response.status !== 200) {
      console.error('Claude API error:', response.status, response.data);
      const errorData = JSON.parse(response.data);
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: errorData.error?.message || 'Failed to analyze bill',
        }),
      };
    }

    const apiResponse = JSON.parse(response.data);
    const analysis = apiResponse.content[0].text;

    return {
      statusCode: 200,
      body: JSON.stringify({ analysis }),
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
