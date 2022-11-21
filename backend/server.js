const express = require('express')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const expressServer = express()
//expressServer.use(express.static(__dirname + '/app'))
//expressServer.get('/', function (request, response) {
//  response.sendFile(__dirname + '/app/index.html')
//})
const JSONParser = express.json({ type: 'application/json' })

mongoose.connect(
  //'mongodb+srv://user12345:12345@cluster1.mgmwwie.mongodb.net/myusers_react',
  'mongodb://localhost:27017/usersdb',
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  (err) => {
    if (err) return console.log(err)
    else if (mongoose.connection.readyState === 1)
      console.log('Mongoose connection established')
    expressServer.listen(process.env.PORT || 3001, function () {
      console.log(`The server is up at PORT ${process.env.PORT || 3001}`)
    })
  }
)

const usersScheme = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  created: { type: String, required: true },
  lastVisit: String,
  active: { type: Boolean, required: true },
})
const User = mongoose.model('User', usersScheme)

expressServer.get('/users', (request, response) => {
  User.find({}, (err, users) => {
    if (err) console.log(err)
    else response.send(users)
  })
})

expressServer.post('/users', JSONParser, async (request, response) => {
  const newUser = new User(request.body)
  try {
    let existingName = await User.findOne({
      name: { $eq: newUser.name },
    }).exec()
    let existingEmail = await User.findOne({
      email: { $eq: newUser.email },
    }).exec()
    if (existingName && existingEmail)
      throw Error('This username and email already exist')
    else if (existingName) throw Error('This username already exists')
    else if (existingEmail) throw Error('This email already exists')
    else {
      newUser.save().then(() => {
        console.log(`Created user "${newUser._id}"`)
        response.send(JSON.stringify(`Server: created user "${newUser._id}"`))
      })
    }
  } catch (err) {
    response.status(400).send({
      message: err.message,
    })
  }
})

expressServer.delete('/users', (request, response) => {
  let userIds = JSON.parse(request.headers.ids)
  User.deleteMany({ _id: userIds })
    .then(() => {
      console.log('Users deleted', userIds)
      response.send(JSON.stringify(`Users deleted: ${userIds}`))
    })
    .catch((err) => {
      if (err) console.log(err)
    })
})

expressServer.put('/users/block', (request, response) => {
  let userIds = JSON.parse(request.headers.ids)
  User.updateMany({ _id: userIds }, { active: request.headers.active })
    .then(() => {
      console.log(`Users' status changed: ${userIds}`)
      response.send(JSON.stringify(`Users' status changed: ${userIds}`))
    })
    .catch((err) => {
      if (err) console.log(err)
    })
})

expressServer.post('/users/auth', (request, response) => {
  const UTCDate = new Date().toUTCString()
  const longDate = `${
    /\d{1,2}\s\D{3}\s\d{4}\s\d{1,2}:\d{1,2}:\d{1,2}/.exec(UTCDate)[0]
  } (UTC)`
  User.findOneAndUpdate(
    {
      name: { $eq: request.headers.name },
      password: { $eq: request.headers.password },
    },
    { lastVisit: longDate }
  ).then((result) => {
    if (result === null) response.send(JSON.stringify('not found'))
    else {
      response.send(JSON.stringify(result))
    }
  })
})

expressServer.get('/users/status', (request, response) => {
  if (!request.headers._id) response.send(false)
  else {
  User.findById(request.headers._id, (err, user) => {
    if (err) console.log(err)
    response.send(user.active)
  })}
})