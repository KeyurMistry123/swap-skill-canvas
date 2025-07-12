 SkillSwap Backend Documentation

## What is SkillSwap?
SkillSwap is a peer-to-peer skill exchange platform that connects people who want to teach and learn from each other. Users can offer their expertise in any skill and request to learn new skills from others, enabling free, community-driven upskilling. The platform is designed to be accessible, efficient, and especially friendly for users in low-network regions.

## Project Overview
- **Peer-to-peer skill exchange:** Users list skills they can teach and skills they want to learn.
- **Secure authentication:** JWT-based login and registration.
- **User profiles:** Public/private profiles with skills, location, and availability.
- **Skill swap requests:** Initiate, accept, or reject skill exchange offers.
- **Feedback system:** Rate and review after each skill swap.
- **Admin dashboard:** Manage users, monitor swaps, export reports, and broadcast messages.
- **Optimized for low bandwidth:** Minimal data transfer, no dependency on external cloud services like Firebase.

---

## Admin Reports Endpoint

### Endpoint
```
GET /admin/reports?report_type=users|swaps|feedback
```
- **Requires:** Admin JWT authentication
- **Query Parameter:** `report_type` (must be one of: `users`, `swaps`, `feedback`)

### Authorization
- Only admin users can access this endpoint. Non-admins receive a 403 Unauthorized error.

### User Report Generation
When `report_type=users`, the backend generates a CSV report of all users with the following columns:

| Column         | Description                                 |
|--------------- |---------------------------------------------|
| ID             | User ID                                     |
| Name           | User's name (email)                         |
| Email          | User's email (same as name in this system)  |
| Status         | 'Active' or 'Banned'                        |
| Skills Offered | Comma-separated list of skills offered      |
| Skills Wanted  | Comma-separated list of skills wanted       |
| Is Public      | 'Yes' if profile is public, else 'No'       |
| Is Banned      | 'Yes' if user is banned, else 'No'          |
| Is Admin       | 'Yes' if user is admin, else 'No'           |

#### CSV Example
```csv
ID,Name,Email,Status,Skills Offered,Skills Wanted,Is Public,Is Banned,Is Admin
1,john@example.com,john@example.com,Active,Python,JavaScript,Yes,No,No
2,admin@skillswap.com,admin@skillswap.com,Active,Management,Leadership,Yes,No,Yes
```

#### Response
Returns a JSON object with:
- `filename`: The generated CSV filename (with timestamp)
- `data`: The CSV file contents as a string

#### Error Handling
- If `report_type` is missing:
  ```json
  { "error": "report_type parameter is required" }
  ```
- If user is not admin:
  ```json
  { "error": "Unauthorized" }
  ```
- If `report_type` is invalid:
  ```json
  { "error": "Invalid report type" }
  ```

---

## Database Schema

### User Table
| Column         | Type      | Description                                 |
|--------------- |-----------|---------------------------------------------|
| id             | Integer   | Primary key, unique user ID                 |
| name           | String    | User's email (used as username)             |
| password_hash  | String    | Hashed password                             |
| location       | String    | User's location                             |
| profile_photo  | String    | URL/path to profile photo                   |
| skills_offered | JSON/List | Skills the user can teach                   |
| skills_wanted  | JSON/List | Skills the user wants to learn              |
| availability   | JSON/List | User's available times                      |
| is_public      | Boolean   | If true, profile is visible to others       |
| is_banned      | Boolean   | If true, user is banned                     |
| is_admin       | Boolean   | If true, user is an admin                   |

### Swap Table
| Column           | Type      | Description                                 |
|------------------|-----------|---------------------------------------------|
| id               | Integer   | Primary key, unique swap ID                 |
| requester_id     | Integer   | User ID of the person requesting the swap   |
| receiver_id      | Integer   | User ID of the person receiving the request |
| offered_skills   | JSON/List | Skills offered by the requester             |
| requested_skills | JSON/List | Skills requested from the receiver          |
| status           | String    | 'pending', 'accepted', or 'rejected'        |

### Feedback Table
| Column        | Type      | Description                                 |
|---------------|-----------|---------------------------------------------|
| id            | Integer   | Primary key, unique feedback ID             |
| from_user_id  | Integer   | User ID of the person giving feedback       |
| to_user_id    | Integer   | User ID of the person receiving feedback    |
| rating        | Integer   | Numeric rating (e.g., 1-5)                  |
| comment       | String    | Optional comment                            |

**Notes:**
- All list fields (skills, availability) are stored as JSON arrays.
- Foreign keys (`requester_id`, `receiver_id`, `from_user_id`, `to_user_id`) reference the `id` column in the `User` table.
- You can easily extend this schema with timestamps (`created_at`, `updated_at`) if needed.

---

This documentation covers the project overview, admin reports endpoint, and the full database schema for SkillSwap. For more details, see the code in `backend/admin.py` and your SQLAlchemy models. 
