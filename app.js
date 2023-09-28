const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const port = 3000
const routes = require('./routes')
const handlebarsHelpers = require('./helpers/handlebars-helper')
// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config()
// }

// helpers ssss別忘
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')
app.use(express.static('public'))


app.use(routes)

app.listen(port, () => {
  console.log('listening now')
})