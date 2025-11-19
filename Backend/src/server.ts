// src/server.ts 

import express from 'express';
import cors from 'cors';
import path from 'path'; // Needed to resolve directory paths
import authRoutes from './routes/authRoutes'; 
import indexRouter from './routes/index'; 
import caseReporterRoutes from "./routes/caseReporterRoutes";

const app = express();
const PORT = process.env.PORT || 5000;

// --- Core Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Good for standard form data

// --- Static File Serving (Crucial for Photos) ---
// The line below makes the files in the 'public/uploads' directory accessible 
// via the web path '/uploads'. This is how the saved photo URL works.
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads'))); 

// --- Route Definitions ---

// 1. HOME PAGE ROUTE
// The root path '/' now returns the API status JSON from your index router
app.use('/', indexRouter); 

// 2. API ROUTES (Prefixing them helps organize)
app.use('/api/auth', authRoutes);

// The case reporter route is registered at '/case'. 
// Your POST endpoint for file upload should be defined within caseReporterRoutes
app.use("/case", caseReporterRoutes); 

// --- Server Start ---
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // A quick check to confirm the static path being served
    console.log(`Serving static uploads from: ${path.join(__dirname, '..', 'public', 'uploads')}`);
});