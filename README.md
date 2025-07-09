#  Backend – Rating System

##  Installation

```bash
git clone https://github.com/IAm-Chinmay/ratingsystem--frontend.git
cd backend
npm install
```

##  Environment Variables

Create a `.env` file in the root directory with the following:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=root
DB_NAME=ratingsystem
JWT_SECRET=donttellanyone
```

##  Built With

- Node.js
- Express.js
- MySQL
- Sequelize
- JWT
- bcrypt
- dotenv
- nodemon

## Scripts

- `npm run dev` – Run server in development with nodemon
- `npm start` – Run server normally
