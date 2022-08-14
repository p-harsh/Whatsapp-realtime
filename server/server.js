import express from 'express';
import mongoose from 'mongoose';
import Cors from 'cors';
import Room from './models/dbRoom.js'
import User from './models/dbUser.js'
import 'dotenv/config';
import Pusher from 'pusher'
import bcrypt from 'bcrypt';

const app = express();
app.use(express.json());
app.use(Cors());

const PORT = process.env.port || 5000;


mongoose.connect(process.env.DB_CONNECTION, { useNewURLParser: true })
    .then(() => console.log('connected to DB!'))
    .catch((err) => console.log(err));


const pusher = new Pusher({
    appId: process.env.PUSHER_APPID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true
});

const db = mongoose.connection;
const messageSchema = mongoose.Schema({
    message: String,
    username: String,
    timeStamp: String,
    room: String
})


db.once('open', () => {
    console.log("Once connected");

    // const msgCollection = db.collection('messages');
    // const changeStream = msgCollection.watch();

    const dbChangeStream = db.watch();
    dbChangeStream.on('change', (change) => {
        // console.log(change);
        if (change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            const collectionRoomName = change['ns']['coll'];
            // console.log(collectionRoomName);
            pusher.trigger(collectionRoomName, 'inserted', {
                username: messageDetails.username,
                message: messageDetails.message,
                timeStamp: messageDetails.timeStamp,
                room: messageDetails.room
            })
        } else {
            console.log('Error triggering Pusher');
        }
    })
})

if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") {
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname + "/client/build/index.html"));
    });
}


app.get('/api', (req, res) => {
    res.status(200).json({ message: 'Working Good!!' })
})

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            const isPasswordConfirmed = await bcrypt.compare(password, existingUser.password);

            if (isPasswordConfirmed) {
                res.status(200).json({ message: 'Successfully Signed In!!' });
            }
            else {
                res.status(400).json({ message: 'Invalid Username or Password' })
            }
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 12);
            const room = [];
            const room__Data = { username: username, room: room }
            User.create({ username, password: hashedPassword }, (err, data) => {
                if (err)
                    res.status(505).json({ message: "Something went wrong" });
                else {
                    Room.create(room__Data, (err, data) => {
                        if (err)
                            res.status(505).json({ message: err });
                        else
                            res.status(200).json({ message: 'Successfully Signed Up', data: data });
                    })
                }
            })
        }
    } catch (error) {
        res.send(error);
    }
});


app.post('/api/message/sync', (req, res) => {
    const messagePost = req.body;
    const roomName = req.body['room'];
    db.collection(roomName);

    // As mongo makes collection name plural so we have to give third parameter containing the collection name
    const Message = mongoose.model(roomName, messageSchema, roomName)

    Message.create(messagePost, (err, data) => {
        if (err)
            res.status(500).send(err);
        else
            res.status(201).send(data);
    })
})

app.get('/api/message/sync/:id', (req, res) => {
    let room = req.params.id;
    const Message = mongoose.model(room, messageSchema, room);
    Message.find((err, data) => {
        if (err)
            res.status(500).send(err);
        else
            res.status(201).send(data);
    })
})

app.get('/api/user/:username', async (req, res) => {
    const username = req.params.username;
    try {
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            res.status(200).json(existingUser.room);
        }
        else {
            res.status(505).json({ message: 'Something went wrong' });
        }
    } catch (error) {
        res.send(error);
    }
})

app.post('/api/room/:username', async (req, res) => {
    const user = req.params.username;
    const room__name = req.body.room;
    try {
        const existing = await Room.updateOne({ username: user }, { $addToSet: { room: room__name } })
        res.status(201).json({ message: "Created Successfully" });
    } catch (error) {
        res.send(error);
    }
})

app.get('/api/room/:username', async (req, res) => {
    const username = req.params.username;
    try {
        const existingUser = await Room.findOne({ username });
        res.status(200).send({ existingUser });
    } catch (error) {
        res.send(error);
    }
})

app.listen(PORT);