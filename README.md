# Integrating With HubSpot I: Foundations Practicum

This is Iurii Paimurzin's Node application for the HubSpot Academy Integrating With HubSpot I: Foundations practicum. It uses Express, Axios, Pug, and the HubSpot CRM API to list and create AI Agent custom object records.

## HubSpot Custom Object

[Open the AI Agents custom object list in the developer test account](https://app.hubspot.com/contacts/246566165/objects/2-232580683/views/all/list)

The custom object has object type ID `2-232580683` and is associated with contacts.

| Property | Internal name | Type |
| --- | --- | --- |
| Name | `name` | String |
| Role | `role` | String |
| Terminal Controller URL | `terminal_controller_url` | String |

The test account contains at least three AI Agent records. One record is associated with the sample contact Maria Johnson.

## Private App

The developer test account contains the private app `Iurii's Practicum Private App` with these required scopes:

- `crm.schemas.custom.read`
- `crm.schemas.custom.write`
- `crm.objects.custom.read`
- `crm.objects.custom.write`
- `crm.objects.contacts.read`
- `crm.objects.contacts.write`

No private app access token is stored in this repository.

## Local Setup

Use Node.js 18 or newer.

```bash
npm install
cp .env.example .env
```

Set the private app access token in `.env`, then start the application:

```bash
npm start
```

Open `http://localhost:3000` unless `PORT` is set to another value.

## Routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/` | Retrieves AI Agent records from HubSpot and renders the homepage table |
| GET | `/update-cobj` | Renders the custom object creation form |
| POST | `/update-cobj` | Creates an AI Agent record and redirects to the homepage |

Run the local route and validation checks with:

```bash
npm test
```
