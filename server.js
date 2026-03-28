const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

const APIFY_TOKEN = 'apify_api_CX6IaFRTEV9fkUu0yQBFYVjwu495lg1SRLaB';

app.get('/health', (req, res) => res.json({ ok: true }));

app.post('/search', async (req, res) => {
  const { query, limit = 12 } = req.body;

  try {
    const response = await fetch(
      `https://api.apify.com/v2/acts/apify~instagram-search-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=60`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchType: 'user',
          searchQueries: [query],
          resultsLimit: limit
        })
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: 'Apify error', detail: err });
    }

    const data = await response.json();
    res.json({ results: data });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));
