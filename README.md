This is a user management app created as part of my internship. Supports user creation, authentication, blocking/unblocking (with automatic logoff if the current user is blocked/removed by themselves or other user), and logging last visits.

Frontend: Typescript, React, Redux Toolkit, RTK Query.
Backend: Node.js, Express, MongoDB.

Live version [here](https://manageusers.cyclic.app/).

The [/dev](https://github.com/malisovm/manageUsers/tree/dev) branch can be launched with `cd frontend && npm start` + `cd backend && node server.js`. If you want to run build, remove the proxy line from package.json and uncomment lines 5-14 in server.js. The compiled version is in the [/deploy](https://github.com/malisovm/manageUsers/tree/deploy) branch.