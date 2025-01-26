# Matchmaking Platform 💕  

A modern matchmaking platform where users can find and connect with their perfect partner. This web application focuses on seamless user experiences and secure interactions, offering personalized partner matches with robust backend support.

---

## 🌟 Features  
- **User-Friendly Interface**: A clean and intuitive UI for easy navigation.  
- **Personalized Matching**: Intelligent matching algorithms to help users find their ideal partner.  
- **Secure Authentication**: Powered by JSON Web Tokens (JWT) for safe and secure login/logout.  
- **Data Validation**: Leveraging Zod for strong and consistent validation of user inputs.  
- **Scalable Backend**: Built with Node.js and Express.js for high performance and scalability.  
- **Robust Database**: MongoDB ensures efficient and reliable data management.  

---

## 🛠️ Tech Stack  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Validation**: Zod  
- **Authentication**: JSON Web Token (JWT)  

---

## 🚀 Getting Started  

Follow these steps to set up the project locally:

### Prerequisites  
Ensure you have the following installed:
- Node.js (v16+ recommended)  
- MongoDB  

### Installation  

1. Clone the repository:  
   ```bash  
   git clone https://github.com/rafin8990/match-making-backend.git
   ```  
2. Navigate to the project directory:  
   ```bash  
   cd matchmaking-platform  
   ```  
3. Install dependencies:  
   ```bash  
   npm install  
   ```  

### Configuration  
Create a `.env` file in the root directory and add the following environment variables:  

```env  
NODE_ENV="production"
PORT=5000;
DATABASE_URL="mongodb+srv://match-making-server:AYRRG9wNmne6ueZH@cluster0.nuouh7o.mongodb.net/match-making-backend?retryWrites=true&w=majority&appName=Cluster0"
BCRYPT_SAULT_ROUND=12
DEFAULT_USER_PASSWORD="user1234"
JWT_SECRET="secret"
JWT_EXPIRES_IN='1d'
JWT_REFRESH_SECRET="very very secret"
JWT_REFRESH_EXPIRES_IN='365d'
EMAIL_HOST="http://localhost:5000/"
EMAIL_PORT=587
EMAIL_USER="rafin8990@gmail.com"
EMAIL_PASSWORD="zlrl gtaw bkwt bixy"
EMAIL_FROM="rafin8990@gmail.com"
NODE_MAILER_EMAIL="fmawji@pamojafm.world",
NODE_MAILER_PASS="Roshan-1949"
```  

### Run the Application  
Start the server:  
```bash  
npm run dev  
```  
The application will be available at `http://localhost:5000` by default.  

---

## 🔐 Security  
- **JWT Authentication**: Ensures secure login sessions.  
- **Input Validation**: Zod prevents invalid or malicious input.  

---

## 🤝 Contributions  
Contributions are welcome! Feel free to fork the repo, submit issues, or open pull requests.  

---

## 📄 Postman API Liknk
Check API <a href="https://documenter.getpostman.com/view/26220833/2sAYQgfnq2">Post Man</a>
