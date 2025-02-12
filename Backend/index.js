// const connectToMongo = require('./db')
// const express = require('express') 
// var cors = require('cors')

// connectToMongo();

// const app = express()
// const port = 5000

// app.use(cors())
// app.use(express.json())


// // ROUTES
// const authRouter = require('./routes/auth.js')
// app.use('/api/auth', authRouter)
// app.use('/api/notes',require('./routes/notes'))

// app.listen(port, () => {
//   console.log(`iNoteBook App listening on port http://localhost:${port}`)
// })


const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors');

connectToMongo();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());  // Fix: added parentheses to call express.json()

// ROUTES
const authRouter = require('./routes/auth.js');
app.use('/api/auth', authRouter);
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`iNoteBook App listening on port http://localhost:${port}`);
});
