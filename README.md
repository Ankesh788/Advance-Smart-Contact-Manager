# Smart Contact Manager

A full-stack contact management application with user authentication, built with Express.js, MongoDB, and a modern web frontend.

## Features

✅ **User Authentication** - Register and login with secure password hashing  
✅ **Contact Management** - Create, read, and delete contacts  
✅ **Analytics** - Track total number of contacts  
✅ **JWT Protection** - Secure API endpoints with token-based authentication  
✅ **Responsive UI** - Beautiful, mobile-friendly interface that runs in Chrome  

## Prerequisites

- Node.js 14+ and npm
- MongoDB running locally (or update MONGO_URI in .env)
- Chrome browser

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

3. **Start the server:**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Open in Chrome:**
   Navigate to `http://localhost:5000` in your Chrome browser

## Project Structure

```
├── app.js                    # Main server file
├── .env                      # Environment variables
├── package.json              # Dependencies
├── routes/
│   ├── authRoutes.js         # Login & Register endpoints
│   ├── contactRoutes.js      # Contact CRUD endpoints
│   └── analyticsRoutes.js    # Analytics endpoints
├── models/
│   ├── User.js               # User schema
│   └── Contact.js            # Contact schema
└── public/
    ├── index.html            # Main HTML page
    ├── styles.css            # Styling
    └── app.js                # Frontend JavaScript
```

## Usage

1. **Register** - Create a new account with name, email, and password
2. **Login** - Sign in with your credentials
3. **Add Contacts** - Enter contact information (name, email, phone, address)
4. **View Analytics** - See your total contact count
5. **Manage Contacts** - Delete contacts as needed

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Contacts
- `GET /api/contacts` - Get all user contacts (requires token)
- `POST /api/contacts` - Add new contact (requires token)
- `PUT /api/contacts/:id` - Update contact (requires token)
- `DELETE /api/contacts/:id` - Delete contact (requires token)

### Analytics
- `GET /api/analytics` - Get contact analytics (requires token)

## Environment Variables

Update `.env` file:
```
MONGO_URI=mongodb://localhost:27017/contact_manager
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

## Troubleshooting

**MongoDB Connection Error?**
- Ensure MongoDB is running: `mongod`
- Check MONGO_URI in .env

**CORS Error?**
- This is already configured in the app
- Make sure you're accessing via `http://localhost:5000`

**Port Already in Use?**
- Change PORT in .env to a different number
- Update Chrome URL accordingly

## License

ISC
