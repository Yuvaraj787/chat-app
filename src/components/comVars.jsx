const ApiUrl =  process.env.NODE_ENV == "production" ? 
                "https://chat-app-backend-pp9x.onrender.com" : 
                "http://localhost:3000";

export { ApiUrl }