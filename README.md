# Japan Travel App

A mobile-first travel planning app with real-time sync for couples.

**Features:**
- Daily itinerary management (add/edit/delete activities)
- Split bill calculator (auto-calculate who owes whom)
- Interactive map with navigation

**Tech Stack:** Vue 3 + Tailwind CSS + Firebase + Leaflet

---

## Quick Start

1. Open `index.html` in browser or deploy to GitHub Pages
2. Enter a shared trip password (e.g., "japan2025")
3. Share the same password with your travel partner
4. Both users see real-time updates!

---

## Firebase Setup (Required)

### 1. Enable Realtime Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `travel-app-d54b5`
3. Build → Realtime Database → Create Database
4. Choose region: `asia-southeast1`
5. Start in test mode

### 2. Add Security Rules

1. Go to Realtime Database → Rules tab
2. Replace with contents of `firebase-rules.json`
3. Click **Publish**

### 3. Get Database URL

After creating the database, copy the database URL and update `index.html`:

```javascript
databaseURL: "https://travel-app-d54b5-default-rtdb.asia-southeast1.firebasedatabase.app"
```

---

## Deploy to GitHub Pages

```bash
# Create repo on GitHub, then:
git init
git add .
git commit -m "Initial commit: Japan travel app"
git remote add origin git@github.com:YOUR_USERNAME/travel-app.git
git push -u origin main

# Enable GitHub Pages:
# Settings → Pages → Source: main branch → Save
```

Access at: `https://YOUR_USERNAME.github.io/travel-app/`

---

## Security Features

- **Anonymous Authentication**: Users must authenticate with Firebase
- **Trip Isolation**: Each password creates a unique trip ID (hashed)
- **Data Validation**: Firebase rules validate all data types and lengths
- **HTTPS Only**: GitHub Pages enforces HTTPS
- **No Sensitive Data Exposed**: API key is safe for client-side (Firebase security rules protect data)

---

## Usage

### Itinerary

1. Add trip dates using [+] button
2. Select a date to view/edit activities
3. Add activities with time, location, and GPS coordinates
4. Click [MAP] to navigate to location

### Split Bill

1. Add expenses with amount and payer
2. Select who to split between
3. View settlement summary (who owes whom)

### Map

1. Activities with GPS coordinates appear as markers
2. Click markers to see details
3. Use location buttons to jump to specific places

---

## Offline Support

- App works offline with cached data
- Changes sync automatically when back online
- Status indicator shows SYNC/OFFLINE state

---

## Customization

Edit `index.html` to customize:

- **Trip members**: Change `tripMembers` default array
- **Categories**: Add/modify activity and expense categories
- **Colors**: Modify Tailwind config colors
- **Map style**: Change tile layer URL for different map themes
