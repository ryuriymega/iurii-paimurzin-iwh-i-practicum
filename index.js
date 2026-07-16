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

app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
    errors: [],
    values: {},
  });
});

app.post('/update-cobj', async (req, res, next) => {
  const values = {
    name: String(req.body.name || '').trim(),
    role: String(req.body.role || '').trim(),
    terminal_controller_url: String(req.body.terminal_controller_url || '').trim(),
  };
  const errors = [];

  if (!values.name) errors.push('Name is required.');
  if (!values.role) errors.push('Role is required.');
  if (!values.terminal_controller_url) {
    errors.push('Terminal Controller URL is required.');
  } else {
    try {
      const url = new URL(values.terminal_controller_url);
      if (url.protocol !== 'https:') errors.push('Terminal Controller URL must use HTTPS.');
    } catch {
      errors.push('Terminal Controller URL must be a valid URL.');
    }
  }

  if (errors.length) {
    return res.status(400).render('updates', {
      title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
      errors,
      values,
    });
  }

  try {
    await hubspot.post('', { properties: values });
    return res.redirect(303, '/');
  } catch (error) {
    return next(error);
  }
});

if (require.main === module) {
  app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
}

module.exports = app;
