require('dotenv').config({ quiet: true });

const express = require('express');
const axios = require('axios');

const app = express();
const port = Number(process.env.PORT) || 3000;
const objectTypeId = process.env.HUBSPOT_OBJECT_TYPE_ID || '2-232580683';
const propertyNames = ['name', 'role', 'terminal_controller_url'];

const hubspot = axios.create({
  baseURL: `https://api.hubapi.com/crm/v3/objects/${objectTypeId}`,
  headers: {
    Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN || ''}`,
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

app.set('view engine', 'pug');
app.disable('x-powered-by');
app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', async (req, res, next) => {
  try {
    const response = await hubspot.get('', {
      params: {
        limit: 100,
        properties: propertyNames.join(','),
      },
    });

    res.render('homepage', {
      title: 'AI Agents | Integrating With HubSpot I Practicum',
      records: response.data.results,
    });
  } catch (error) {
    next(error);
  }
});

// The form GET and POST routes are added in the next milestone.

if (require.main === module) {
  app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
}

module.exports = app;
