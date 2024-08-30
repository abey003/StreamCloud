const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const kidsShowRoutes = require('./routes/kids');

app.use(cors());
app.use(express.json());

require('./connections/connection');

// Use auth routes
app.use('/auth', authRoutes);

// Use movie routes
app.use('/movies', movieRoutes);

// Use kids show routes
app.use('/kids', kidsShowRoutes);

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
