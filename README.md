# To-do task manager

A simple, local to-do task manager for tracking and completing everyday tasks.

## Goals

- **Add new to-do items**: create tasks with a text description
- **Edit existing to-do items**: update the text of a task after creation
- **Mark items as completed**: toggle tasks between incomplete and completed states
- **Delete items**: permanently remove tasks from the list

## Non-Goals

- User accounts or authentication
- Cloud sync or multi-device support
- Recurring or scheduled tasks
- Priority levels, sorting, or filtering
- Notifications or reminders
- Collaboration or sharing

## Assumptions

- **No backend-for-frontend (BFF) server**: The frontend calls the API directly. API endpoints are exposed to the client, which is acceptable since this app is for internal/personal use only.
- **No data persistence**: The backend uses an in-memory SQLite database, so all tasks are lost when the server restarts. This is by design for a lightweight, disposable task list.
- **No authentication**: The app assumes single-user, local-only usage with no login or access control.
- **Permissive CORS**: CORS is configured to allow all methods and headers from `localhost:3000`. This is fine for local development but would need to be locked down for any production deployment.
- **No backend input validation**: The API trusts that the frontend sends well-formed data. There is no server-side validation middleware or request sanitization.
- **Local dev dependencies required**: There is no Docker or containerization setup. Running the app requires .NET 8.0 and Node.js installed locally.

## Tradeoffs

- **In-memory SQLite vs. persistent database**: Zero setup with no database to install, configure, or migrate, but all data is lost when the backend restarts.
- **Vanilla `fetch` vs. a library like Axios or React Query**: No extra dependencies and a smaller bundle, but loading and error states must be handled manually in every call with no built-in retry, caching, or deduplication.
- **Local component state vs. global state management (i.e. Redux)**: Simple and easy to follow with all state in `App.tsx`, but prop-drilling becomes a problem if the app grows to more pages or deeper component trees.
- **Vanilla CSS vs. a framework (Tailwind, CSS Modules)**: No build tooling overhead and full control over styles, but class names are global so naming collisions are possible as the app grows.
- **Optimistic local state updates vs. refetching from server**: The UI feels snappy because state updates immediately from the API response, but there is no mechanism to re-sync if data changes externally and no rollback on error.
- **Request models in the controller file vs. separate files**: Everything for the API is in one place making it easy to find, but the file would get crowded as more controllers or models are added.

## In the Future

- **Persistent database**: Replace the in-memory SQLite database with a persistent store (e.g. CosmosDB, SQL Server) so tasks survive server restarts and connection drops.
- **Authentication**: Add user accounts and login so the app can securely identify who is making requests.
- **Backend-for-frontend (BFF)**: If the app were made public-facing, introduce a BFF server to sit between the frontend and API so that API endpoints are not directly exposed to clients.
- **Collaboration**: Allow multiple users to share and work on the same task lists. This would require real-time sync via polling, server-sent events (SSE), or WebSockets so that changes from one collaborator are streamed to others immediately.
- **Sorting and filtering**: Add the ability to sort tasks (e.g. by creation date, alphabetically) and filter them (e.g. show only completed or incomplete tasks) to make managing larger lists easier.
- **Pagination**: Add paginated API responses and UI controls so that very long task lists don't load all items at once, improving performance and usability.

## Running application
1. Start backend: cd backend/TaskManagerAPI && dotnet run
2. Start frontend: cd frontend && npm install && npm start
3. Open browser to [localhost:3000](http://localhost:3000)
