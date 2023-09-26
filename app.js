const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const port = 3000
const routes = require('./routes')

// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config()
// }
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')
app.use(express.static('public'))


app.use(routes)

app.listen(port, () => {
  console.log('listening now')
})