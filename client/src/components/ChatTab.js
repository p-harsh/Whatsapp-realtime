import React from 'react'
import { Avatar } from '@material-ui/core'

import './ChatTab.css'

const ChatTab = ({ room, setChatRoom }) => {
    return (
        <div>
            <div className="chatTab__container" onClick={() => setChatRoom(room)}>
                <Avatar />
                <div className="chatTab__info">
                    <h5>{room}</h5>
                    <i>{'Last Message - Service Unavailable Right Now'}</i>
                </div>
            </div>
        </div>
    )
}

export default ChatTab
