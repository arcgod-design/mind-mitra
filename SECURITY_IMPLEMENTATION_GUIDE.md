# 🛡️ SECURITY_IMPLEMENTATION_GUIDE.md

> For: **MindMitra – Emotion-Aware Companion App**
> Role: **Backend Engineer**
> Editor: **Cursor AI Compatible**
> Author: Cybersecurity Lead
> Date: July 14, 2025

---

## ✅ OVERVIEW

This guide provides actionable, code-friendly cybersecurity best practices for MindMitra's backend. Each section includes code snippets, inline comments, and a checklist for implementation. Use this as a living document and update as the codebase evolves.

---

## 🔐 1. USER AUTHENTICATION & ACCESS CONTROL

> 🔧 **Use Firebase Auth** (with email/password or Google Sign-in)

```python
# Firebase Auth handles JWT under the hood
# For server-side auth validation (Python FastAPI example)
from firebase_admin import auth

def verify_user(token):
    decoded_token = auth.verify_id_token(token)
    uid = decoded_token['uid']
    return uid
```

**To Do:**

* [ ] Setup Firebase Auth SDK in backend.
* [ ] Create middleware to verify token & extract `uid`.
* [ ] Apply **RBAC** (roles: `user`, `therapist`, `admin`, `sos_contact`).

---

## 🔒 2. API SECURITY

> 💡 All endpoints should be behind HTTPS, and validate inputs with Pydantic or FastAPI types.

```python
# FastAPI Pydantic Example
from pydantic import BaseModel

class JournalEntry(BaseModel):
    mood: str
    content: str

@app.post("/journal")
async def save_entry(entry: JournalEntry, user_id: str = Depends(verify_user)):
    ...
```

**To Do:**

* [ ] Enable **TLS (HTTPS)** only.
* [ ] Rate limit API (e.g., 100 req/min/user).
* [ ] Validate all payloads (voice, image, text).
* [ ] Enable **CORS** only for frontend domains.

---

## 🗝️ 3. ENCRYPTION STANDARDS

> 🔐 Store all sensitive data encrypted using AES-256 or rely on Firebase's encryption-at-rest.

```python
# Optional: Manual AES encryption for extra protection
from Crypto.Cipher import AES
import base64

key = b'Sixteen byte key'
cipher = AES.new(key, AES.MODE_EAX)
ciphertext, tag = cipher.encrypt_and_digest(b'sample text')
```

**To Do:**

* [ ] Enable **encryption at rest** (Firebase default).
* [ ] Store SOS, journal, and emotional logs in encrypted Firestore fields.
* [ ] Use **Signed URLs** for Firebase Storage (e.g., voice or image files).
* [ ] Auto-delete biometric files after processing (24–72 hrs).

---

## 🤖 4. ML MODEL SECURITY

> 🧠 Your AI models (emotion via face/voice/text) must run in **isolated containers** with sanitized input.

```bash
# Containerize your model server
docker build -t mindmitra-emotion-api .
docker run -p 8000:8000 --env SECURE_API_KEY=xxx mindmitra-emotion-api
```

**To Do:**

* [ ] Deploy models in **Docker** behind internal API Gateway.
* [ ] Never expose raw image/audio via logs or API responses.
* [ ] Add headers like `Authorization: Bearer SECURE_API_KEY`.

---

## 📦 5. FIREBASE SECURITY RULES

> ✋ Enforce access rules directly in Firestore and Storage for role-based access.

```javascript
// Firestore.rules
match /journal/{userId} {
  allow read, write: if request.auth.uid == userId;
}

// Storage.rules
match /user_uploads/{uid}/{fileName} {
  allow read, write: if request.auth.uid == uid;
}
```

**To Do:**

* [ ] Restrict DB & Storage access using Firebase Rules.
* [ ] Only allow therapists/admins to access user data with consent.
* [ ] Add logging for all admin read actions.

---

## 🚨 6. SOS & LOCATION DATA FLOW

> 📍 SOS alerts involve sending sensitive emotional triggers + user location.

**To Do:**

* [ ] Trigger SOS via backend when:

  * Sentiment is highly negative
  * Facial emotion = severe distress
  * Heart rate anomaly (if integrated via wearable)
* [ ] Mask exact location (use city-level unless critical).
* [ ] Allow user override with PIN cancel option.
* [ ] Log SOS event only with `uid`, timestamp, and risk level.

---

## 🔁 7. PRIVACY, COMPLIANCE & USER RIGHTS

> 🧾 You **must** provide endpoints to delete/export user data to comply with GDPR and India’s DPDP Bill.

```python
@app.delete("/user/delete")
def delete_user_data(uid: str):
    # Delete all journal, mood, SOS, etc.
    ...
```

**To Do:**

* [ ] Add `DELETE /user/delete` route to remove all data.
* [ ] Add `GET /user/export` to export encrypted logs in `.json`.
* [ ] Log user consent for:

  * Camera/mic usage
  * Chatbot interaction
  * SOS escalation

---

## 🧪 8. SECURITY TESTING CHECKLIST

> 🎯 Recommended tools & steps before hackathon demo

| Tool           | Usage                                    |
| -------------- | ---------------------------------------- |
| **OWASP ZAP**  | Auto-scan API for common vulnerabilities |
| **Postman**    | Validate all endpoints need auth         |
| **Snyk**       | Scan dependencies for vulnerabilities    |
| **Burp Suite** | Manual test for injection flaws          |

---

## 🧾 FINAL BACKEND CHECKLIST

| Task                                          | Done? |
| --------------------------------------------- | ----- |
| Firebase Auth + JWT Verification Middleware   | ☐     |
| Secure AI Model APIs behind Gateway           | ☐     |
| AES-256 Encrypted Journal & SOS Data          | ☐     |
| Firestore & Storage Rules Implemented         | ☐     |
| Delete & Export User Data APIs                | ☐     |
| API Rate Limiting (e.g., via Cloudflare/Kong) | ☐     |
| SOS Handling Pipeline with Threshold Logic    | ☐     |
| Privacy Logs for Consent                      | ☐     |
| HTTPS & Secure Headers (CSP, HSTS, etc.)      | ☐     |
| Security Audit Run (ZAP/Burp)                 | ☐     | 