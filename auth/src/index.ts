import express from 'express'

const app = express()
app.use(express.json())

app.get('/api/users/me', (req, res) => {
  res.send('Current user!!!')
})

app.listen(3000, () => console.log('Server listening on port 3000'))