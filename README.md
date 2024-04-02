# Overview

This is the back-end for a possible app used to conduct walk audits. Walk audits are on-the-ground reports that "assess and report on the safety and walkability of a street, intersection or neighborhood — and inspire needed change," [per the AARP website](https://www.aarp.org/livable-communities/getting-around/aarp-walk-audit-tool-kit.html).

In broad strokes, the data structure is:

> A walk audit consists of several location entries
> A location entry can capture the following data about a location: notes, time of day, longitutde and latitude, photos, ratings for things like tree cover, lights, accessibility

This is an Express API that saves data in a MongoDB cluster. It uses Mongoose to do object mapping and PassportJS to do authentication.

# Before running

### Pre-requisites:

- Node >v16 installed
- A `.env` file at the root of your project with the following properties defined with valid values:

```
MONGO_DB_URI
MONGO_DB_USER
MONGO_DB_PASSWORD
SECRET_OR_KEY // a secret used by Passport to generate a user's token
```

# Run the server

Run while listening for changes: `npm run start-api-dev`

# Run tests

`npm run test`

# Authenticating to the endpoints

1. You must have a user registered. (`POST` to the `/register` endpoint with `email` and `password` in the JSON request body).
2. Request login with your registered credentialss (`POST` to the `/login` endpoint with the registered username and password).
3. Take the bearer token generated and pass it as an `Authorization` header.

# Current todos:

Typescript
CommonJS > ES6
Make the API response, especially for errors, better, reusable
Pagination on certain responses (get entries)
Get the Postman collection source controlled

Other name ideas:

- Sweet Streets
- Walk Wise
