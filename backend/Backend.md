---

# 📘 Backend + Practice Foundation
**Project:** Time-Based Travel Companion Platform

---

## 🟢 PHASE 1 — Learn Node + Express Properly (Hands-On)

Before building features, your team must understand:

1. How to run Node
2. How to create an Express server
3. How to connect Supabase
4. How to test APIs
5. How to see data in Supabase

**No shortcuts.**

---

### 1️⃣ What is Node.js? (With Practical Setup)

**Definition (Simple)**
Node.js lets you run JavaScript outside the browser.

Instead of this running in Chrome:
```javascript
console.log("Hello");
```
It runs in your terminal.

---

### 🧪 Practice 1: Run Node

**Step 1: Install Node**
Download from: [nodejs.org](https://nodejs.org)

**Step 2: Check Installation**
```bash
node -v
```
If it shows a version → good.

---

### Step 3: Create Practice File

Create file: `test.js`

Add:
```javascript
console.log("Server is alive");
```

Run:
```bash
node test.js
```

You should see:
```text
Server is alive
```
That means Node works.

---

### 2️⃣ What is Express?

Express helps you create APIs easily.
* Without Express → you manually handle HTTP.
* With Express → you define routes easily.

---

### 🧪 Practice 2: Create Simple Server

**Step 1: Create Project Folder**
```bash
mkdir backend
cd backend
npm init -y
```

**Step 2: Install Express**
```bash
npm install express
```

---

**Step 3: Create server.js**

```javascript
const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
```

Run:
```bash
node server.js
```

Open browser:
`http://localhost:3000`

You should see:
`Server Running`

Now your team understands routing.

---

### 3️⃣ What is Supabase?

Supabase is:
* PostgreSQL database
* Hosted in cloud
* Has dashboard
* Has tables
* Has API

You will use it as: **👉 Cloud database**

---

### 🧪 Practice 3: Connect Supabase to Express

**Step 1: Install Supabase Client**
```bash
npm install @supabase/supabase-js
```

---

**Step 2: Add Connection Code**

Inside `server.js`:
```javascript
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "YOUR_SUPABASE_URL",
  "YOUR_SUPABASE_ANON_KEY"
);
```

Get these from:
**Supabase → Project Settings → API**

---

### 🧪 Practice 4: Create Test Table in Supabase

In Supabase SQL Editor:
```sql
create table test_table (
  id uuid default uuid_generate_v4() primary key,
  name text
);
```

---

### 🧪 Practice 5: Insert Data from Backend

Add route:
```javascript
app.post("/test", async (req, res) => {
  const { name } = req.body;

  const { data, error } = await supabase
    .from("test_table")
    .insert([{ name }])
    .select()
    .single();

  res.json(data);
});
```

Test in Postman:
* **POST** → `http://localhost:3000/test`
* **Body** → JSON:
```json
{
  "name": "Yash"
}
```

Then check **Supabase Table Editor** → You will see the row.

Now your team understands full flow:
**Frontend → Express → Supabase → Database**

Good. Now we build features.

---

# FULL FEATURE BREAKDOWN (Deep Explanation Mode)

---

## ✅ FEATURE 1: Trip Creation

---

### 🎯 Real Purpose
This is the core engine of your platform.
Without trips → platform has no meaning.

A trip represents:
* A destination
* A date range
* A group opportunity

It is basically a **“travel event”**.

---

### 👤 User Flow
1. User browses destination
2. User selects dates
3. User clicks "Create Trip"
4. System creates trip
5. Creator automatically becomes first member

---

### 📦 What This Feature Consists Of

**1️⃣ Date Validation**
You must check:
* Start date < End date
* Start date is not in past
* End date not too far in future (optional)

---

**2️⃣ Business Logic**
When trip is created:
* Insert into `trips`
* Insert creator into `trip_members`
* Prevent duplicate member entry

---

**3️⃣ Future Expandability**
Later you may add:
* Max group size
* Trip status (open, full, cancelled)
* Private/public trips
* Gender-specific filtering
* Budget range

So design cleanly.

---

### 🗄 Required Tables

**trips**
Stores:
* Who created
* Where
* When
* When created

---

**trip_members**
Stores:
* Who joined which trip
* When they joined

This allows:
* Counting members
* Removing members
* Managing groups

---

### ⚠ Edge Cases to Handle
* What if user creates same trip twice?
* What if creator tries to leave?
* What if dates overlap with their other trip?

Even if not implemented now, team should know.

---

### 🧪 Postman Testing for Trip Creation

**POST** → `/trips`
```json
{
  "creator_id": "uuid",
  "destination_id": "uuid",
  "start_date": "2026-03-01",
  "end_date": "2026-03-05"
}
```

Check:
* 200 response?
* Row inserted in trips?
* Row inserted in trip_members?

If yes → working.

---

### ⚛ React Test Component (Just for Understanding)
Even if not using now:

```javascript
import { useState } from "react";
import axios from "axios";

function TestTripCreation() {
  const [form, setForm] = useState({
    creator_id: "",
    destination_id: "",
    start_date: "",
    end_date: ""
  });

  const submit = async () => {
    const res = await axios.post(
      "http://localhost:3000/trips",
      form
    );
    console.log(res.data);
  };

  return (
    <div>
      <input placeholder="Creator ID"
        onChange={e => setForm({...form, creator_id: e.target.value})}/>
      <input placeholder="Destination ID"
        onChange={e => setForm({...form, destination_id: e.target.value})}/>
      <input type="date"
        onChange={e => setForm({...form, start_date: e.target.value})}/>
      <input type="date"
        onChange={e => setForm({...form, end_date: e.target.value})}/>
      <button onClick={submit}>Create Trip</button>
    </div>
  );
}

export default TestTripCreation;
```
This is just to simulate frontend behaviour.

---

## ✅ FEATURE 2: Join / Leave Trip

---

### 🎯 Real Purpose
This feature transforms:
**Solo trip → Group trip.**
This is the entire USP of your platform.

---

### 👤 User Flow
1. User sees trip
2. Clicks "Join"
3. Backend inserts into `trip_members`
4. Member count increases

If user leaves:
* Remove row from `trip_members`

---

### 📦 What This Feature Includes

**1️⃣ Duplicate Prevention**
User should not join same trip twice.
So ideally:
Add unique constraint:
`unique(trip_id, user_id)`

---

**2️⃣ Capacity Check (Optional Future)**
If trip max capacity = 5
Check before inserting.

---

**3️⃣ Creator Protection**
If creator leaves → what happens?
Options:
* Delete trip
* Transfer ownership
* Prevent leaving

Team must discuss.

---

### 🧪 Postman Testing

**Join**
`POST /trips/:tripId/join`
```json
{
  "user_id": "uuid"
}
```

**Leave**
`DELETE /trips/:tripId/leave`
```json
{
  "user_id": "uuid"
}
```

Check table after each action.

---

### ⚛ React Test Code

```javascript
const joinTrip = async (tripId) => {
  await axios.post(
    `http://localhost:3000/trips/${tripId}/join`,
    { user_id: "USER_UUID" }
  );
};

const leaveTrip = async (tripId) => {
  await axios.delete(
    `http://localhost:3000/trips/${tripId}/leave`,
    { data: { user_id: "USER_UUID" } }
  );
};
```
Again — for understanding only.

---

## ✅ FEATURE 3: Destination Module

---

### 🎯 Real Purpose
This gives platform content.
Without destinations → user cannot explore.
This is discovery layer.

---

### 👤 User Flow
1. User opens platform
2. Sees destinations list
3. Clicks one
4. Reads details
5. Creates trip from it

---

### 📦 What This Feature Contains
* Static data (initially)
* Descriptions
* Best time to visit
* Season info

Later possible additions:
* Images
* Ratings
* Reviews
* Budget level
* Weather API integration

---

### 🧪 Postman Testing
* `GET /destinations`
* `GET /destinations/:id`

---

### ⚛ React Fetch Example

```javascript
import { useEffect, useState } from "react";
import axios from "axios";

function TestDestinations() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/destinations")
      .then(res => setData(res.data));
  }, []);

  return (
    <div>
      {data.map(d => (
        <div key={d.id}>
          <h3>{d.name}</h3>
          <p>{d.description}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## ✅ FEATURE 4: Travel Highlights

---

### 🎯 Real Purpose
This builds:
**Community + Engagement + Content**
After trip → users post experience.

---

### 👤 User Flow
1. User completes trip
2. Writes short story
3. Other users read highlights
4. Builds trust + inspiration

---

### 📦 Feature Includes
* Title
* Description
* User ID
* Destination ID
* Timestamp

Later you may add:
* Images
* Likes
* Comments
* Trip reference ID

---

### 🧪 Postman Testing

**POST** → `/highlights`
```json
{
  "user_id": "uuid",
  "destination_id": "uuid",
  "title": "Best Goa Trip Ever",
  "description": "Amazing sunsets..."
}
```

**GET** → `/highlights`

---

### ⚛ React Example

```javascript
function TestHighlight() {
  const submit = async () => {
    await axios.post(
      "http://localhost:3000/highlights",
      {
        user_id: "uuid",
        destination_id: "uuid",
        title: "Test",
        description: "Test highlight"
      }
    );
  };

  return <button onClick={submit}>Post Highlight</button>;
}
```

---

## 🧠 What Your Team Should Clearly Understand

This backend system consists of:
1. Core entity → **Trips**
2. Relationship → **Trip Members**
3. Static entity → **Destinations**
4. Community layer → **Highlights**

And every feature follows:
**User Action → API → Validation → Database Insert → Response**


