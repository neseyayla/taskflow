## TaskFlow API

TaskFlow is a Trello-lite REST API built with **Node.js**, **TypeScript**, and **Express**.

### Requirements

- Node.js (LTS recommended)
- npm

### Installation

```bash
npm install
```

### Running the dev server

```bash
npm run dev
```

By default the server listens on port `3000`, or you can override it with `PORT`:

```bash
# PowerShell
$env:PORT = 4000
npm run dev
```

### Environment variables

- **PORT**: (optional) Port for the HTTP server. Defaults to `3000` if not set.

You can also create a `.env` file:

```env
PORT=3000
```

### Basic endpoints

- **GET /health**

  - Response: `200 OK`
  - Body:
    ```json
    {
      "ok": true
    }
    ```

- **GET /api**

  - Response: `200 OK`
  - Body:
    ```json
    {
      "name": "TaskFlow API"
    }
    ```

- **GET /api/ping**

  - Response: `200 OK`
  - Body:
    ```json
    {
      "pong": true
    }
    ```

- **POST /api/ping**

  - Request body:
    ```json
    {
      "message": "hello"
    }
    ```
  - Response: `200 OK`
  - Body:
    ```json
    {
      "received": "hello"
    }
    ```

