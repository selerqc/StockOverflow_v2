

![License](https://img.shields.io/github/license/selerqc/StockOverflow_v2)
![Issues](https://img.shields.io/github/issues/selerqc/StockOverflow_v2)
![Stars](https://img.shields.io/github/stars/selerqc/StockOverflow_v2)

## Purpose and Scope

**StockOverflow_v2** is a comprehensive, multi-tenant inventory management system designed for businesses needing robust role-based access control. It provides a modern React-based frontend, a secure backend API, and a scalable MongoDB datastore.

---

## Features

- **Role-Based Access Control:** Supports Admin, Business Owner, and Employee roles, each with granular permissions.
- **Inventory Management:** Product CRUD operations, categorization, and stock tracking.
- **Order Processing:** Transaction management and workflow automation.
- **User Administration:** Multi-level user management with secure authentication.
- **Analytics Dashboard:** Business intelligence and reporting tailored to each role.
- **Alert System:** Real-time notifications for inventory and system events.
- **Responsive UI:** Mobile-friendly design using Ant Design and Framer Motion.

---

## Architecture Overview

- **Frontend:** React SPA (Single Page Application) with React Router and Ant Design.
- **Backend:** Node.js with Express.js REST API.
- **Database:** MongoDB for document storage.
- **Authentication:** JWT-based login/register and session management.
- **Security:** Protected and permission-based routes for every endpoint.

```
App.jsx
 ├─ Dashboard (role-based)
 │    ├─ AdminDashboard
 │    ├─ BusinessOwnerDashboard
 │    └─ EmployeeDashboard
 ├─ Products
 ├─ Orders
 ├─ ManageUsers
 ├─ Categories
 ├─ Analytics
 ├─ Settings
 └─ Alerts
```

---

## User Roles and Permissions

| Role           | Dashboard                  | Key Permissions                                   | Restricted Features              |
|----------------|---------------------------|---------------------------------------------------|----------------------------------|
| **Admin**      | admin-dashboard           | Full system/user management, analytics            | None (full access)               |
| **Business Owner** | businessowner-dashboard | Employee/inventory management, analytics          | No full user admin               |
| **Employee**   | employee-dashboard        | Inventory, order processing, basic alerts         | No user admin, limited analytics |

**Permission Keys:**
- `VIEW_ANALYTICS`, `VIEW_PRODUCTS`, `VIEW_CATEGORIES`, `VIEW_ORDERS`
- `VIEW_USERS` (Admin), `VIEW_EMPLOYEES` (Business Owner)
- `VIEW_ALERTS`, `MANAGE_SETTINGS`

---

## Core Technologies

- **Frontend:** React, Ant Design, Framer Motion, React Router, sessionStorage
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Authentication:** JWT
- **Styling:** CSS Modules, Poppins font

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB instance

### Installation

```bash
git clone https://github.com/selerqc/StockOverflow_v2.git
cd StockOverflow_v2
npm install
# For the frontend
cd frontend
npm install
npm start
# For the backend
cd ../backend
npm install
npm run dev
```

### Environment Variables

Set up your `.env` file in `/backend` with required variables such as:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---

## File Structure Highlights

- `frontend/src/App.jsx` — Main Application Entry
- `frontend/src/components/` — Role-based dashboards and shared components
- `backend/` — REST API and services

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## License

Distributed under the MIT License.

---

Let me know if you’d like a more tailored section (screenshots, usage guide, API documentation, etc.) or want this content in a specific format!