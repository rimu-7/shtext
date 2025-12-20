# Secure Snippet Share 🔐  
Share sensitive text securely with optional password protection and automatic expiration.

This project is a lightweight “pastebin-style” app built with **Next.js App Router** and **MongoDB**. Users can create a text snippet, optionally protect it with a **password**, and set an **expiration time**. After expiration, the snippet is automatically removed via a MongoDB TTL index.

---

## ✨ Features

- ✅ **Create secure snippets** (text only)
- ✅ **Optional password protection** (bcrypt hash stored in DB)
- ✅ **Custom PIN / slug** (e.g., `project-alpha`)
- ✅ **Auto-generated PIN** when no custom value is provided
- ✅ **Expiration control** (15m, 30m, 1h, 2h, 24h, 7d)
- ✅ **MongoDB TTL auto-delete** when the timer ends
- ✅ **Lock screen** for password-protected snippets
- ✅ **Copy link** (auto-copy after create + manual copy button)
- ✅ **Anonymous + transient** sharing (no login needed)

---
<img src="public/image.png" alt="Project Preview" />
<img src="public/image copy.png" alt="Project Preview" />
<img src="public/image copy 2.png" alt="Project Preview" />


## 🧱 Tech Stack

- **Next.js (App Router)**
- **MongoDB + Mongoose**
- **TailwindCSS**
- **bcryptjs**
- **nanoid**
- **sonner** (toasts)
- **lucide-react** (icons)

---

## 📦 Project Structure (Important)

```

.
├── app
│   ├── [slug]
│   │   ├── page.jsx
│   │   └── SnippetClient.jsx
│   ├── api
│   │   └── snippet
│   │       └── verify
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.js
│   ├── page.js
│   └── privacy-policy
│       └── page.jsx
├── components
│   ├── Footer.jsx
│   ├── Hero.jsx
│   └── Navbar.jsx
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── README.md
└── utils
    ├── action.js
    ├── db.js
    └── Snippet.js

10 directories, 26 files

````

✅ API routes must live under: `app/api/...`  
If you place them elsewhere (e.g., under `privacy-policy`), Next.js will return **404**.

---

## ⚙️ Environment Variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI="your_mongodb_connection_string"
````

Example:

```env
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/snippetdb?retryWrites=true&w=majority"
```

---

## 🚀 Getting Started

### 1) Install dependencies

Using pnpm:

```bash
pnpm install
```

Or npm:

```bash
npm install
```

### 2) Run the dev server

```bash
pnpm dev
# or
npm run dev
```

Open:

* `http://localhost:3000`

---

## 🔐 How Password Protection Works

When creating a snippet, users can choose:

* **Public** → anyone with the link can read it
* **Password Protected** → a password is required to unlock

### Important Security Notes

* Passwords are **never stored in plain text**
* The DB stores a **bcrypt hash** in the `password` field
* When someone tries to unlock, the client sends:

  * `slug`
  * `password`
    to `/api/snippet/verify`
* The server compares using bcrypt and returns the snippet content only on success

---

## ⏳ Expiration & Auto-Deletion

Each snippet has an `expireAt` field. A MongoDB TTL index deletes the document when it expires:

```js
SnippetSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
```

✅ Even if MongoDB takes some time to physically delete the record, the app also checks `expireAt` before returning content and treats expired snippets as **not found**.

---

## ✅ API Endpoint

### Verify snippet password

**POST** `/api/snippet/verify`

Request body:

```json
{
  "slug": "yourSnippetSlug",
  "password": "yourPassword"
}
```

Response (success):

```json
{
  "success": true,
  "content": "secret text..."
}
```

Response (wrong password):

```json
{
  "success": false,
  "message": "Incorrect password."
}
```

---

## 🧪 Testing Checklist

1. Create a snippet as **Public**

   * Open link in another browser ✅ should show content

2. Create a snippet as **Password Protected**

   * Open link in another browser ✅ should ask for password
   * Enter wrong password ✅ should show error
   * Enter correct password ✅ should unlock

3. Test expiration

   * Create a snippet with 15 minutes
   * After expiration ✅ should be treated as not found

---


## 📄 License

MIT — feel free to use and modify.

---

## 👤 Author

Built by **Rimu / Mutasim**

```
rimubhai.com
```
