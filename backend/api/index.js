const express = require('express')
const app = express()
app.use(express.json())
const userRoutes = require('./routes/user')
const groupRoutes = require('./routes/group')
const { routes, isValidRequest } = require('./routes/auth')

require('dotenv').config()
const cors = require('cors')
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use('/auth', routes)
app.use('/usuarios', userRoutes)
app.use('/grupos', isValidRequest, groupRoutes)


app.listen(process.env.API_PORT, () => console.log(`API LISTENING IN ${process.env.API_PORT}`))