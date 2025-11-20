import express from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";

//import "./config/passport";
//import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

/*
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
}));

*/

app.use(passport.initialize());
app.use(passport.session());

//app.use("/auth", authRoutes);

app.get("/", (_, res) => {
  res.send("Backend is running.");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
