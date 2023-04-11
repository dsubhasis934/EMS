import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import Chatbox from './Chatbox';
import axios from 'axios';
function Chat({ socket }) {
    const getToken = localStorage.getItem("token");
    const [takeReceiver, setTakeReceiver] = useState('');
    const findToken = JSON.parse(getToken)
    const { name, id } = findToken;
    const [userName, setUsername] = useState("");
    const [receiver, setReceiever] = useState("")
    const [room, setRoom] = useState("");
    const [chatBox, setChatBox] = useState(false);
    // const { id } = useParams();
    // const justId = id.split('&&');
    const qparams = useLocation().search;
    const qdata = new URLSearchParams(qparams)
    const roomId = qdata.get('room')
    const receiverName = qdata.get('receiver')
    const receiverId = qdata.get('receiverId')
    const image = qdata.get('image')
    console.log(roomId);
    //setRoom(roomId);
    const conversastionData = { name, receiverName, roomId, id };


    const joinRoom = () => {
        console.log(`your room is ${roomId}`);
        if (roomId !== "") {
            socket.emit("join_room", conversastionData);
            setChatBox(true);
        }
    }
    // const loadUserdata = async () => {
    //     await axios.get(`http://localhost:3000/api/fetchuser?id=${id}`)
    //         .then(response => {
    //             console.log(response);
    //             const { data, message, success } = response.data;
    //             setTakeReceiver(data.name);

    //             if (success) {
    //                 const rmtext = takeReceiver.split(" ").join("")
    //                 const mergeName = rmtext.concat(name);
    //                 const sortName = mergeName.split(" ").sort().join("");
    //                 setRoom(sortName)

    //             }
    //             setReceiever(name)
    //         })
    //         .catch(error => { alert(error) })
    // }

    useEffect(() => {
        //console.log(conversastionData.name);
        joinRoom();
    }, [])

    return (
        <>

            {!qparams ? (
                //design code for enter name and room id for chat
                // <div className="chat-background">
                //     <div className="d-flex justify-content-center align-items-center flex-column">
                //         <div className="chat-header mt-3 fs-4">
                //             <h1 className='text-white'>Join Our chatroom</h1>
                //         </div>
                //         <div className="chat-input d-flex flex-column justify-content-center align-items-center">
                //             <input type="text" className='mt-2' name="" id="" placeholder="your name" onChange={(e) => { setUsername(e.target.value) }} />
                //             <input type="text" className='mt-4' name="" id="" placeholder="your room no" onChange={(e) => { setRoom(e.target.value) }} />
                //             <button className="joinRoom" onClick={joinRoom}>Join</button>
                //         </div>

                //     </div>
                // </div>
                <h1>OOPS!!User not found</h1>

            ) : (
                <Chatbox socket={socket} userName={name} room={roomId} receiver={receiverName} receiverId={receiverId} image={image} />
            )

            }
        </>
    )
}

export default Chat
