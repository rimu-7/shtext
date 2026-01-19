# Sh...TEXT — Secure Self-Destructing Notes

Sh...TEXT is a production-ready, secure Pastebin alternative. It allows users to share sensitive information (passwords, API keys, confidential notes) via temporary, encrypted links that self-destruct after a set duration.

Built with Next.js App Router, protected by AES-256 Encryption, and hardened against abuse with Upstash Rate Limiting.

---

## Features

*  Self-Destructing: Notes are automatically deleted from the database after expiration (TTL).
*  Zero-Leak Storage: Content is encrypted with AES-256-CBC before it touches the database. Even the admin cannot read the notes.
*  Password Protection: Optional bcrypt-hashed password protection for extra security.
*  Anti-Abuse System: Integrated Upstash Redis rate limiting to prevent brute-force attacks and spam.
*  API-First Design: Secure API endpoints guarded by `x-api-key` headers for Mobile App integration.
*  Modern UI: Built with Tailwind CSS, Shadcn UI, and Lucide Icons.

---

## Tech Stack

* Framework: Next.js 14 (App Router, Server Actions)
* Database: MongoDB (Mongoose ORM)
* Rate Limiting: Upstash Redis (`@upstash/ratelimit`)
* Styling: Tailwind CSS
* Components: Shadcn UI
* Cryptography: Node.js `crypto` (AES-256) & `bcryptjs`

---

## Getting Started

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/rimu-7/shtext.git
cd sh-text

```

### 2. Install Dependencies

```bash
npm install

```

### 3. Environment Setup

Create a `.env` file in the root directory. You need to generate secure keys for this.

Generate Keys (Run in terminal):

```bash
# Generate Encryption Key (32 bytes / 64 hex chars)
openssl rand -hex 32

# Generate API Access Keys (16 bytes / 32 hex chars)
openssl rand -hex 16

```

Paste into `.env`:

```env
# 1. Database Connection
MONGODB_URI="mongodb+srv://your_user:your_pass@cluster.mongodb.net/sh-text"

# 2. Upstash Redis (For Rate Limiting)
# Create a free database at https://console.upstash.com/
UPSTASH_REDIS_REST_URL="https://your-db.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_upstash_token"

# 3. Security (AES-256 Encryption) - MUST be 64 characters long
ENCRYPTION_KEY="paste_your_generated_64_char_key_here"

# 4. API Authorization
# Comma-separated list of keys allowed to access the API (e.g. one for Web, one for Android)
API_SECRET_KEYS="web-key-12345,android-key-67890"

# 5. Frontend Access
# Must match one of the keys above so the website can talk to the API
NEXT_PUBLIC_WEB_API_KEY="web-key-12345"

```

### 4. Run the Server

```bash
npm run dev

```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser.

---

## Security Architecture

This project implements a multi-layered security approach:

1. Transport Layer: All data relies on HTTPS (Standard Vercel deployment).
2. Access Layer:
* API Keys: Routes are protected by a whitelist of API keys.
* Rate Limiting: IP and Key-based throttling prevents bot attacks (10 req/10s).


3. Application Layer:
* Passwords: Hashed using `bcrypt` (work factor 10). Plain text passwords are never stored.


4. Data Layer:
* Encryption: Content is encrypted using `AES-256-CBC` with a unique Initialization Vector (IV) for every record.
* TTL: MongoDB handles automatic deletion of expired records.



---

## API Documentation

This backend is designed to serve both the web frontend and mobile apps.

Base URL: `https://your-domain.com`

### Headers Required

All requests must include the API Key header:
| Header | Value | Description |
| :--- | :--- | :--- |
| `Content-Type` | `application/json` | Standard JSON payload |
| `x-api-key` | `your_secret_key` | From `.env` allowed list |

### 1. Create Snippet

POST `/api/snippet/create`

Body:

```json
{
  "text": "Secret content here...",
  "duration": "1h",          // Options: 15m, 30m, 1h, 2h, 6h, 12h, 24h, 7d
  "customSlug": "my-pin",    // Optional: Custom URL ending
  "password": "secret_pass"  // Optional: Password protection
}

```

Response (200 OK):

```json
{
  "success": true,
  "slug": "my-pin"
}

```

### 2. Verify & Retrieve Snippet

POST `/api/snippet/verify`

Body:

```json
{
  "slug": "my-pin",
  "password": "secret_pass" // Required if snippet is protected
}

```

Response (200 OK):

```json
{
  "success": true,
  "content": "Secret content here..."
}

```

---

## Project Structure

```bash
├── app
│   ├── [slug]
│   │   ├── page.jsx
│   │   └── SnippetClient.jsx
│   ├── api
│   │   └── snippet
│   │       ├── create
│   │       └── verify
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.js
│   ├── page.js
├── components
│   ├── Footer.jsx
│   ├── Hero.jsx
│   ├── ModeToggle.jsx
│   ├── Navbar.jsx
│   ├── theme-provider.jsx
└── utils
    ├── action.js
    ├── auth.js
    ├── crypto.js
    ├── db.js
    ├── ratelimit.js
    ├── Session.js
    └── Snippet.js

```

---

## Contributing

Contributions are welcome!

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.
