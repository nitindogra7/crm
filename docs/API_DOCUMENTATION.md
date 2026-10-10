# Salenova API Documentation

This document describes the REST API endpoints, request contracts, security conventions, and integration patterns for the Salenova API.

---

## 1. General Conventions

### Base URLs
- **Local Development**: `http://localhost:4000`
- **Docker Network**: `http://api:4000`
- **Production**: `https://api.salenova.com` (configured via reverse proxy)

### Content Types
- Ingestion endpoints accept both `application/json` and `application/x-www-form-urlencoded` (standard HTML form submits).
- Responses are returned in `application/json; charset=utf-8`.

---

## 2. Endpoints Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Service and database health check | No |
| `POST` | `/f/:formId` | Ingest public form submission | No (Form Key) |
| `GET` | `/api/forms` | List all registered forms *(Admin)* | Yes (Bearer/Cookie) |
| `POST` | `/api/forms` | Create a new form endpoint *(Admin)* | Yes (Bearer/Cookie) |
| `GET` | `/api/forms/:formId/submissions` | Retrieve submissions for a form *(Admin)* | Yes (Bearer/Cookie) |

---

## 3. Endpoints Detail

### 3.1 Health Check

Checks whether the Express service is running and verifies active connectivity to PostgreSQL.

- **URL**: `/health`
- **Method**: `GET`
- **Authentication**: None

#### Response (200 OK)
```json
{
  "ok": true
}
```

#### Response (500 Service Unavailable)
```json
{
  "ok": false,
  "error": "Database connection failed"
}
```

---

### 3.2 Ingest Form Submission

Receives form inputs from external websites, landing pages, or mobile apps, applies spam detection, and persists the lead.

- **URL**: `/f/:formId`
- **Method**: `POST`
- **Headers**:
  - `Content-Type: application/json` OR `Content-Type: application/x-www-form-urlencoded`
- **Parameters**:
  - `formId` (string, required): The unique identifier of the registered form (e.g., `form_clx123abc`).

#### Request Body (JSON Example)
```json
{
  "email": "sarah.connor@cyberdyne.io",
  "name": "Sarah Connor",
  "company": "Tech Security Co",
  "message": "Looking to schedule a demo for our marketing team.",
  "website": "" 
}
```

> **Note on Honeypots**:
> The `website` field is designated as an anti-spam honeypot. Legitimate submissions should leave this field empty. If this field contains any string, the submission will be marked with disposition `blocked_honeypot`.

#### Response (200 OK - Lead Accepted)
```json
{
  "success": true,
  "id": "sub_cm71a8bc0001",
  "disposition": "accepted",
  "createdAt": "2026-10-11T03:00:00.000Z"
}
```

#### Response (200 OK - Lead Flagged as Spam)
```json
{
  "success": true,
  "id": "sub_cm71a8bc0002",
  "disposition": "blocked_honeypot",
  "message": "Submission received"
}
```

#### Response (404 Not Found - Invalid Form ID)
```json
{
  "success": false,
  "error": {
    "code": "FORM_NOT_FOUND",
    "message": "No active form found with the provided identifier."
  }
}
```

---

## 4. Code Integration Examples

### 4.1 Plain HTML Form

```html
<form 
  action="http://localhost:4000/f/form_clx123abc" 
  method="POST"
>
  <div>
    <label for="name">Full Name</label>
    <input type="text" id="name" name="name" required />
  </div>

  <div>
    <label for="email">Work Email</label>
    <input type="email" id="email" name="email" required />
  </div>

  <div>
    <label for="message">Message</label>
    <textarea id="message" name="message" rows="4"></textarea>
  </div>

  <!-- Hidden Honeypot Field -->
  <input 
    type="text" 
    name="website" 
    tabindex="-1" 
    autocomplete="off" 
    style="display:none;" 
  />

  <button type="submit">Submit Form</button>
</form>
```

---

### 4.2 TypeScript / React / Next.js Hook

```typescript
import { useState } from "react";

export function useSalenovaForm(formId: string) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const submitForm = async (payload: Record<string, unknown>) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/f/${formId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Submission failed with status: ${response.status}`);
      }

      setStatus("success");
      return await response.json();
    } catch (err) {
      setStatus("error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitForm, loading, status };
}
```

---

### 4.3 cURL Command

```bash
curl -X POST http://localhost:4000/f/form_clx123abc \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Developer",
    "email": "jane@example.com",
    "inquiry": "Enterprise pricing request"
  }'
```

---

### 4.4 Python `requests`

```python
import requests

payload = {
    "name": "Alex Smith",
    "email": "alex.smith@example.com",
    "plan_interest": "Pro Growth"
}

response = requests.post(
    "http://localhost:4000/f/form_clx123abc",
    json=payload,
    headers={"Content-Type": "application/json"}
)

print(response.status_code)
print(response.json())
```
