import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { AiOutlineSend } from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineFileSearch } from 'react-icons/ai'
import { default_image } from '../images/Images';
function Chatbox({ socket, userName, room, receiver, receiverId, image }) {
    const notify = () => toast.success("Message Received");
    const [message, setMessage] = useState("")
    const [receiverName, setReceieverName] = useState('');
    const [roomId, setRoomId] = useState('')
    const [senderName, setSenderName] = useState("")
    const [showMessage, setShowMessage] = useState([])
    const [showMessageState, setShowMessageState] = useState([])
    const [displayReceiverList, setDisplayReceiverList] = useState([]);
    const [receiverList, setReceiverList] = useState([])
    const getToken = localStorage.getItem("token");
    const findToken = JSON.parse(getToken)
    const { name, id } = findToken
    const [notification, setNotification] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const navigate = useNavigate();
    const [selectedChat, setSelectedChat] = useState([])
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:3000/api/fetchchat?room=${room}&receiver=${receiver}&receiverId=${receiverId}`)
            .then(resp => {
                const { data } = resp.data;
                console.log(data);
                setSelectedChat(data);
                data.forEach(element => {
                    setShowMessage(d => { return [...d, element] })
                    //console.log(showMessage);
                });

            })
            .catch(cat => { console.log(cat.error) });
    }, [room, receiver, receiverId])
    const sendMessage = async () => {
        if (message !== "") {
            const date = new Date();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const period = hours >= 12 ? "PM" : "AM";
            const formattedHours = hours % 12 || 12;
            const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
            const messageData = {
                room: room,
                author: userName,
                message: message,
                authorId: id,
                id: socket.id,
                receiver: receiver,
                receiverId: receiverId,
                time: formattedHours + ":" + formattedMinutes + " " + period,
                image: image
            }
            // const updatedReceiverList = receiverList.map(receiver => {
            //     if (receiver._id === receiverId) {
            //         return {
            //             ...receiver,
            //             lastMessage: messageData
            //         }
            //     }
            //     return receiver;
            // });
            // setReceiverList(updatedReceiverList);
            // setDisplayReceiverList(updatedReceiverList);
            // console.log(JSON.stringify(messageData));

            // await axios.post(
            //     "http://localhost:3000/api/lastMessage",
            //     messageData
            // ).then(resp => {
            //     const { success, message, data } = resp.data;
            //     if (success) {
            //         // data.deleteOne({ _id: messageData._id });

            //         // // Insert a new document
            //         // const newDocument = data.create(messageData);
            //         //socket.emit("send_sms", newDocument)
            //         console.log(data);
            //     }
            // });

            await socket.emit("send_sms", messageData)
            setShowMessageState(messageData);
            setShowMessage((oldmessage) => { return [...oldmessage, messageData] });
            setMessage("");

        }

    }

    useEffect(() => {
        socket.on("received_data", (data) => {
            console.log(data);
            if (findToken.id == data.receiverId) {

                setShowMessage((oldmessage) => { return [...oldmessage, data] });
                //setDisplayReceiverList(data);
                //console.log(data);
                notify();
            }

        },)

    }, [socket, showMessageState])
    // useEffect(() => {
    //     socket.on('notification', (data) => {
    //         if (data.type === 'message_received') {
    //             // show a notification to the user
    //             console.log(`You have received a message from ${data.sender} in room ${data.room}: ${data.message}`);
    //         }
    //     });
    // }, [socket])
    function isUserInChatRoom(userId) {
        // Implement your logic here to check if the user is in the chat room
        // You can use the state variable `showMessage` to get the list of users who are currently in the chat room
        return showMessage.some((msg) => msg.authorId === userId || msg.receiverId === userId);
    }
    //In this example, we added an isUserInChatRoom function that checks if the given user ID is present in the showMessage state variable (which contains the list of users who are currently in the chat room). We then added an extra condition in the socket.on("received_data", ...) function to check if the current user is the sender of the message and if the receiver is not currently in the chat room. If this condition is true, we log a message to the console indicating that the user is not in the chat room and we can then add our code to send a notification.







    const handleChange = (e) => {
        setSearchInput(e.target.value);
        if (e.target.value == "") {
            setDisplayReceiverList(receiverList);
        } else {
            // update state with current value of input field
            const receiverFilter = receiverList.filter((elem) => {
                return elem._id.toLowerCase().includes(e.target.value.toLowerCase()); // use current value of input field to filter receiverList
            });
            setDisplayReceiverList(receiverFilter);
        }
    };

    const startChat = (getReceiverId, getName) => {
        console.log(senderName)
        // const msgItem = displayReceiverList.find(({ receiverId }) => {
        //     return (getReceiverId === receiverId)
        // })
        // console.log(msgItem);

        const rmtext = getName.toLowerCase().split(" ").join("");
        const lowercaseName = findToken.name.toLowerCase();
        const mergeName = rmtext.concat(lowercaseName);
        const sortName = mergeName.split('').sort().join('');
        console.log(sortName);
        setRoomId(sortName);
        setReceieverName(getName);
        const joinRoom = () => {
            const conversastionData = { name, receiverName, roomId };
            console.log(`your room is ${sortName}`);
            if (sortName !== "") {
                socket.emit("join_room", conversastionData);
            }
        }
        joinRoom();
        setShowMessage([])
        navigate({
            pathname: `/chat`,
            search: `?room=${sortName}&receiver=${getName}&receiverId=${getReceiverId}`
        });
    }


    // useEffect(() => {
    //     //console.log(findToken);
    //     socket.on("message_received", (data) => {
    //         //console.log(data);
    //         //alert(data);
    //         if (findToken.id == data.receiverId) {
    //             console.log("message recived");

    //         }
    //     })
    // })
    useEffect(() => {
        axios.get('http://localhost:3000/api/fetchreceiver')
            .then(res => {
                console.log(res.data);
                const { status, data, message } = res.data;
                console.log(data);
                if (status) {
                    // const updatedReceiverList = data.map(receiver => {
                    //     const lastMessage = (receiver.message.authorId === findToken.name && receiver.message.receiverId === receiver._id) ||
                    //         (receiver.message.receiverId === findToken.name && receiver.message.authorId === receiver._id);
                    //     return {
                    //         ...receiver,
                    //         lastMessage
                    //     };
                    // });


                    //when we need to work with resp data we need to filter that data first and store it in a variable for use it
                    const receiverListFilter = data.filter(list => list.message.authorId === findToken.id || list.message.receiverId === findToken.id)
                    //const receiverListFilter = updatedReceiverList.filter(list => list.lastMessage);
                    const filterReceiverList = receiverListFilter.filter(receiver => receiver._id !== findToken.name)
                    setReceiverList(filterReceiverList)
                    setDisplayReceiverList(filterReceiverList)
                    const imageDisplay = data.filter(list => list.message.image)
                    // }
                    //setSenderName(data._id)
                } else {
                    console.log("error");
                }
            })
    }, [showMessageState])
    const leave_room = () => {
        socket.emit('leave_room');
        navigate('/showusers');
    }
    return (
        <>
            <div className="chatbox-background">
                <div className="container pt-3 fs-3">
                    <h3 className=" text-center text-white">send {receiver} from {userName} </h3>
                    <button onClick={leave_room}>leave room</button>
                    <div className="messaging">
                        <div className="inbox_msg">
                            <div className="inbox_people">
                                <div className="headind_srch">
                                    <div className="recent_heading">
                                        <h4>Recent</h4>
                                    </div>
                                    <div className="srch_bar">
                                        <div className="stylish-input-group">
                                            <input type="text" className="search-bar" placeholder="Search" value={searchInput} onChange={handleChange} />
                                            {/* <span className="input-group-addon">
                                                <button type="button" onClick={(e) => { handelSubmit(e.target.value) }}> <AiOutlineFileSearch /> </button>
                                            </span> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="inbox_chat">
                                    {displayReceiverList.map((messageShow) => {
                                        const { _id } = messageShow;
                                        const { time, message, receiverId, image } = messageShow.message
                                        console.log(image);
                                        // const binaryImage = atob(image);
                                        // const actualImage = Blob([binaryImage], { type: 'image/jpeg/webp' })
                                        // setImageUrl(URL.createObjectURL(actualImage));
                                        return (

                                            <div className="chat_list active_chat" onClick={() => { startChat(receiverId, _id) }}>
                                                <div className="chat_people">
                                                    {/* in image src we need to give this path because we store this images as a static so we need to give the static path */}
                                                    <div className="chat_img"> <img src={!image ? default_image : `http://192.168.1.136:3000/images/${image}`}
                                                        alt="default" /> </div>

                                                    <div className="chat_ib">
                                                        <h5>{_id} <span className="chat_date">{time}</span></h5>
                                                        <p>{message}</p>
                                                    </div>


                                                </div>
                                            </div>

                                        )
                                    })
                                    }

                                </div>
                            </div>
                            <div className="mesgs bg-light">
                                <div className="msg_history">
                                    <div className="incoming_msg">
                                        {/* <!-- <div className="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png"
                                    alt="sunil"> </div> -->

                                    <!-- {showMessage.length > 0 && showMessage.map((messageList) => {
                                        return (
                                            <div key={messageList.id} id={userName == messageList.author ? "you" : "other"}>
                                                <p>{messageList.message}</p>
                                                <p>{messageList.time}</p>
                                            </div>
    
                                        )
                                    }
                                    )} --> */}


                                        {showMessage.length > 0 && showMessage.map((messageList) => {
                                            return (
                                                <div key={messageList.id} className={userName == messageList.author ? "outgoing_msg" : "received_msg"}>
                                                    <div className={userName == messageList.author ? "sent_msg" : "received_withd_msg"} key={messageList.id}>
                                                        <p>{messageList.message}</p>
                                                        <span className="time_date">{messageList.time}</span>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        )
                                        }
                                    </div>

                                </div>
                                <div className="type_msg">
                                    <div className="input_msg_write">
                                        <input type="text" className="write_msg" onKeyUp={(e) => { e.key === "Enter" && sendMessage() }} placeholder="Type a message" value={message} onChange={(e) => { setMessage(e.target.value) }} />
                                        <button className="msg_send_btn" type="button" onClick={sendMessage}><AiOutlineSend className="send-icon" /></button>
                                        <ToastContainer autoClose={1500} />
                                    </div>
                                </div>
                            </div>
                        </div>




                    </div>
                </div>
            </div>

        </>
    )
}

export default Chatbox
