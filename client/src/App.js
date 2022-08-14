import React, { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import Chat from './components/Chat'
import Pusher from 'pusher-js'
import axios from './axios'

import './app.css'

const App = () => {
  const [prevMessages, setPrevMessages] = useState([])
  const [chatRoom, setChatRoom] = useState("");
  // const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    if (chatRoom !== "") {
      axios.get(`/api/message/sync/${chatRoom}`)
        .then((res) => setPrevMessages(res.data))
        .catch((err) => console.log(err))
    }
  }, [chatRoom])
  useEffect(() => {
    let pusher = new Pusher('4c943768445e659e587e', {
      cluster: 'ap2'
    });

    let channel = pusher.subscribe(chatRoom);
    channel.bind('inserted', function (data) {
      setPrevMessages([...prevMessages, data])
    });

    return (() => {
      channel.unbind_all();
      channel.unsubscribe();
    })
  }, [prevMessages, chatRoom]);
  return (
    <>
      <div className="app">
        <div className="app__body">
          <Sidebar chatRoom={chatRoom} setChatRoom={setChatRoom} />
          <Chat prevMessages={prevMessages} setPrevMessages={setPrevMessages} chatRoom={chatRoom} setChatRoom={chatRoom} />
        </div>
      </div>
    </>
  );
}

export default App;
