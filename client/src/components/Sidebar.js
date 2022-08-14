import React, { useEffect, useState } from 'react'
import DonutLargeIcon from '@material-ui/icons/DonutLarge'
import ChatIcon from '@material-ui/icons/Chat'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { Avatar, IconButton, Modal, Box, Button, Typography, TextField } from '@material-ui/core'
import { SearchOutlined } from '@material-ui/icons'
import AddIcon from '@material-ui/icons/Add';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import axios from 'axios'
import history from '../history.js'

// import Modal from '@mui/material';

import ChatTab from './ChatTab'
import './Sidebar.css'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


const Sidebar = ({ chatRoom, setChatRoom }) => {
    const [open, setOpen] = useState(false);
    const [rooms, setRooms] = useState([]);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleLogout = () => {
        sessionStorage.removeItem('username');
        history.push('/login');
        window.location.reload();
    }
    useEffect(() => {
        if (sessionStorage.length > 0) {
            axios.get(`/api/room/${sessionStorage.getItem('username')}`)
                .then(res => {
                    setRooms(res.data.existingUser.room)
                })
                .catch(err => console.error(err))
        }
    }, [])


    const handleCreate = (e) => {
        e.preventDefault();
        let room__name = e.target['0'].value;
        e.target['0'].value = "";
        setOpen(false);
        axios.post(`/api/room/${sessionStorage.getItem('username')}`, { room: room__name })
            .then(res => {
                console.log("Done it completely!!")
                setChatRoom(room__name)
                setRooms([...rooms, room__name])
            })
            .catch(err => console.error(err))
    }

    const handleAvatarUpload = (e) => {
        console.log(e.target)
    }
    return (
        <div className="sidebar">
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className='modal__container'
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Create or Enter a room
                    </Typography>
                    {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}> */}
                    <form action="" onSubmit={handleCreate}>
                        <TextField required={true} id="standard-basic" label="Room Name" variant="standard" /><br />
                        <Button sx={{ mt: 4 }} type='submit' variant="contained" color="primary">Create/Enter</Button>
                    </form>
                    {/* </Typography> */}
                </Box>
            </Modal>
            <div className="sidebar__header">
                <IconButton
                    variant="contained"
                    component="label"
                    onChange={handleAvatarUpload}
                >
                    <Avatar src='https://www.whitesourcesoftware.com/wp-content/media/2020/07/3-inA.jpg' />
                    <input
                        type="file"
                        accept=".png, .jpg, .jpeg"
                        hidden
                    />
                </IconButton>
                <div className="sidebar__headerRight">
                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                    <IconButton onClick={handleLogout}>
                        <ExitToAppIcon color='secondary' />
                    </IconButton>
                </div>
            </div>
            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchOutlined />
                    <input placeholder="Search or start new chat" type="text" />
                </div>
            </div>
            <div className="sidebar__chats">
                {
                    rooms.map((room) => {
                        return (
                            <ChatTab room={room} setChatRoom={setChatRoom} />
                        )
                    })
                }
                <IconButton onClick={handleOpen}>
                    <AddIcon fontSize='large' color='white' />
                </IconButton>
            </div>
        </div>
    )
}

export default Sidebar
