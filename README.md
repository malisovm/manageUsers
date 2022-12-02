# Manage Users

This is a sample user management app created as part of my internship. Supports user creation, simplified authentication (without JWT), blocking/unblocking (with automatic logoff if the current user is blocked/removed by themselves or other user), and logging last visits.

### Stack

- Typescript
- React
- Bootstrap
- Redux Toolkit
- RTK Query
- Node.js
- Express
- MongoDB

### Live version

A deployed version is available here [here](https://manageusers.cyclic.app/)

### Building

The [/dev](https://github.com/malisovm/manageUsers/tree/dev) branch can be launched with `cd frontend && npm start` + `cd backend && node server.js`. If you want to run build, remove the proxy line from package.json and uncomment lines 5-14 in server.js. The compiled version is in the [/deploy](https://github.com/malisovm/manageUsers/tree/deploy) branch.