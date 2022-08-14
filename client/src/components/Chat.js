import React from 'react';
import { Avatar, IconButton, Card } from '@material-ui/core';
import { AttachFile, MoreVert, SearchOutlined } from '@material-ui/icons'
import SendIcon from '@material-ui/icons/Send';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon'
import axios from 'axios'

import './Chat.css'

const Chat = ({ prevMessages, setPrevMessages, chatRoom }) => {
    const handleSend = async (e) => {
        e.preventDefault();
        let messageToSend = e.target['0'].value;
        let data = { message: messageToSend, username: sessionStorage.getItem('username'), room: chatRoom, timeStamp: new Date().toUTCString() }
        await axios.post('/api/message/sync', data)
            .then((res) => console.log(res))
            .catch((err) => console.log(err))
        e.target['0'].value = "";
        let bodyElement = e.target['parentElement']['parentElement']['childNodes'][1];
        bodyElement['scrollTop'] = bodyElement['scrollHeight'];
    }
    return (
        <div className='chat'>
            <div className="chat__header">
                <Avatar />
                <div className="chatHeader__info">
                    <h4>{chatRoom}</h4>
                </div>
                <div className="chat__headerRight">
                    <IconButton><SearchOutlined /></IconButton>
                    <IconButton><AttachFile /></IconButton>
                    <IconButton><MoreVert /></IconButton>
                </div>
            </div>
            {/* To always remain scrolled to bottom, added script in index.html in public folder */}
            <div className="chatContent__body" id="chatContent__body">
                {
                    chatRoom === ""
                        ?
                        <Card><h2>Select a room</h2></Card>
                        :
                        <>
                            {prevMessages.map((message) => {
                                return (
                                    <p key={message['_id']} className={`chat__message ${(message['username'] === sessionStorage.getItem('username')) && 'chat__received'}`}>
                                        <span className="chat__name">{message.username}</span>
                                        {message['message']}
                                        <span className="chat__timestamp">{message['timeStamp']}</span>
                                    </p>
                                )
                            })}
                        </>
                }
            </div>
            <div className="chat__footer">
                {/* <IconButton> */}
                <InsertEmoticonIcon />
                {/* </IconButton> */}
                <form className="chat__typeMessage" onSubmit={handleSend} onEnter={handleSend}>
                    <input type="text" disabled={chatRoom === ""} placeholder="Enter the message..." name="" id="" />
                    <IconButton type='submit' disabled={chatRoom === ""}>
                        <SendIcon />
                    </IconButton>
                </form>
            </div>
        </div>
    )
}

export default Chat
