import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { AiOutlineSend } from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineFileSearch } from 'react-icons/ai'
import { default_image } from '../images/Images';
import useSWR from 'swr'
import { useSelector } from 'react-redux';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'
import { BsFillCameraVideoFill } from 'react-icons/bs'
function Chatbox({ socket, userName, room, receiver, receiverId, image, authorImage }) {
    console.log(room)
    const loggedUserData = useSelector((state) => state.counter.loggedInuser)
    console.log(loggedUserData[0].image)
    const notify = () => toast.success('Message Received', { autoClose: 1200 });
    const [sentMessage, setSentMessage] = useState("chat-message-right pb-4");
    const [receivedMessage, setreceivedMessage] = useState("chat-message-left pb-4");
    const [message, setMessage] = useState("")
    const [receiverName, setReceieverName] = useState('');
    const [roomId, setRoomId] = useState('')
    const [senderName, setSenderName] = useState("")
    const [lastMessages, setLastMessages] = useState([]);
    const [showMessage, setShowMessage] = useState([])
    const [showMessageState, setShowMessageState] = useState([])
    const [displayReceiverList, setDisplayReceiverList] = useState([]);
    const [displayReceivedMsg, setDisplayReceivedMsg] = useState({ message: {} })
    const [receiverList, setReceiverList] = useState()
    const [chatColor, setChatColor] = useState("bg-purple")
    const getToken = localStorage.getItem("token");
    const findToken = JSON.parse(getToken)
    console.log(findToken);
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
                image: image,
                authorImage: authorImage
            }


            await socket.emit("send_sms", messageData)
            setShowMessageState(messageData);
            setShowMessage((oldmessage) => { return [...oldmessage, messageData] });
            setMessage("");
            setLastMessages((prevMessages) => ({
                ...prevMessages,
                [receiverId]: {
                    message: message,
                    time: messageData.time,
                },
            }));
        }

    }

    useEffect(() => {
        socket.on("received_data", (data) => {
            console.log(data);
            if (findToken.id == data.receiverId) {

                setShowMessage((oldmessage) => { return [...oldmessage, data] });
                const { author, authorId, id, image, message, receiver, receiverId, room, time, authorImage } = data
                const displayReceivedMsg = { message: { author, authorId, id, image, message, receiver, receiverId, room, time, authorImage } };

                setDisplayReceivedMsg(displayReceivedMsg);
                console.log(displayReceivedMsg);

                setDisplayReceiverList([displayReceivedMsg]);
                //console.log(data);
                // notify();
            }

        },)

    }, [socket]) //remove "showMessageState" from dependancy array
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
    //     axios.get('http://localhost:3000/api/fetchreceiver')
    //         .then(res => {
    //             console.log(res);
    //             const { status, data, message } = res.data;
    //             console.log(data);
    //             if (status) {


    //                 //when we need to work with resp data we need to filter that data first and store it in a variable for use it
    //                 const receiverListFilter = data.filter(list => (list.message.authorId === id || list.message.receiverId === id))
    //                 //const receiverListFilter = updatedReceiverList.filter(list => list.lastMessage);
    //                 console.log(receiverListFilter)
    //                 const filterReceiverList = receiverListFilter.filter(receiver => receiver._id !== findToken.name)
    //                 setReceiverList(filterReceiverList)
    //                 setDisplayReceiverList(filterReceiverList)
    //                 // ...
    //                 const imageDisplay = data.filter(list => list.message.image)
    //                 // }
    //                 //setSenderName(data._id)
    //             } else {
    //                 console.log("error");
    //             }
    //         })
    // }, [showMessageState])
    useEffect(() => {
        axios.get('http://localhost:3000/api/fetchreceiver')
            .then(res => {
                const { status, data, message } = res.data;
                if (status) {
                    // Filter the receiver list based on the sender's messages
                    const receiverListFilter = data.filter(list => {
                        return (
                            (list.message.authorId === id && list.message.receiver === receiver) ||
                            (list.message.receiverId === id && list.message.author === userName)
                        );
                    });

                    const filterReceiverList = receiverListFilter.filter(receiver => receiver._id !== findToken.name);

                    // Update the last messages for each receiver
                    let lastMessagesData = {};
                    receiverListFilter.forEach(receiver => {
                        const receiverId = receiver.message.receiverId || receiver.message.authorId;
                        let lastMessage = {
                            message: receiver.message.message,
                            time: receiver.message.time,
                        };
                        lastMessagesData = lastMessage;
                    });
                    console.log(lastMessagesData)
                    setLastMessages(lastMessagesData);

                    setReceiverList(filterReceiverList);
                    setDisplayReceiverList(filterReceiverList);
                } else {
                    console.log("error");
                }
            });
    }, [showMessageState]);


    const leave_room = () => {
        socket.emit('leave_room');
        navigate('/showusers');
    }
    const changeTheme = (color) => {
        if (color === "purple") {
            setChatColor("bg-purple")
            setSentMessage("sent_msg_purple")
            setreceivedMessage("received_withd_msg_purple")
        }
        else if (color === "dark") {
            setChatColor("bg-dark");
            setSentMessage("sent_msg_dark")
        }
        else {
            setChatColor("bg-default");
            setSentMessage("chat-message-right pb-4")
            setreceivedMessage("chat-message-left pb-4")
        }
    }
    useEffect(() => {
        if (setChatColor === "bg-dark") {

        }
    }, [setChatColor])

    const myMeeting = async (element) => {
        const appID = 852752793;
        const serverSecret = "6cdf2c120e80ca9e4c147ca1e11e9947";
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID, serverSecret, room, loggedUserData[0]._id, userName
        )
        const zc = ZegoUIKitPrebuilt.create(kitToken)
        zc.joinRoom({
            container: element,
            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall,

            },
            showScreenSharingButton: false
        })
    }
    return (
        <>
            {console.log(loggedUserData)}
            <div className="chatbox-background">
                <div className="container pt-3 fs-3">
                    {/* <h3 className=" text-center text-white">send {receiver} from {userName} </h3> */}
                    <div className="left-room">
                        <div className="theme-buttons" style={{ display: 'flex', gap: 10 }}>
                            <button className="chatbox-buttons bg-purple" onClick={() => changeTheme("purple")}></button>
                            <button className="chatbox-buttons bg-dark" onClick={() => changeTheme("dark")}></button>
                            <button className="chatbox-buttons bg-default" onClick={() => changeTheme()}></button>
                        </div>
                        <button className="btn btn-primary" onClick={() => myMeeting()}><BsFillCameraVideoFill />  join</button>
                        <button className="button-leave" onClick={leave_room}>leave room</button>
                    </div>
                    <div className="messaging" style={{ marginTop: 8 }}>
                        <div className="inbox_msg">
                            {/* <div className="inbox_people">
                                <div className="headind_srch">
                                    <div className="recent_heading">
                                        <h4>Recent</h4>
                                    </div>
                                    <div className="srch_bar">
                                        <div className="stylish-input-group">
                                            <input type="text" className="search-bar" placeholder="Search" value={searchInput} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="inbox_chat">
                                    {displayReceiverList.map((messageShow) => {

                                        console.log(messageShow)
                                        const { _id } = messageShow;
                                        const { time, message, author, authorImage, receiver, receiverId, image } = messageShow.message
                                      
                                        return (

                                            <div className="chat_list active_chat" onClick={() => { startChat(receiverId, _id) }}>
                                                <div className="chat_people">
                                                    
                                                    <div className="chat_img"> <img src={!image ? default_image : `http://localhost:3000/images/${!(receiverId == id) ? image : authorImage}`}
                                                        alt="default" /> </div>

                                                    <div className="chat_ib">
                                                        <h5>{!(receiverId == id) ? receiver : author} <span className="chat_date">{time}</span></h5>
                                                        <p>{message}</p>
                                                    </div>


                                                </div>
                                            </div>

                                        )
                                    })
                                    }

                                </div>
                            </div> */}
                            <div className={chatColor}>
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



                                        {/* {showMessage.length > 0 &&
                                            showMessage.map((messageList, index) => {
                                                console.log(messageList);
                                                const isLastMessage =
                                                    index === showMessage.length - 1 ||
                                                    messageList.author !== showMessage[index + 1]?.author;

                                                return (
                                                    <div
                                                        key={messageList.id}
                                                        className={
                                                            userName === messageList.author ? "outgoing_msg" : "received_msg"
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                userName === messageList.author ? `${sentMessage}` : `${receivedMessage}`
                                                            }
                                                            key={messageList.id}
                                                        >
                                                            {isLastMessage && (
                                                                <img
                                                                    src={
                                                                        typeof messageList.image === "string" ||
                                                                            !(messageList.image instanceof Blob)
                                                                            ? `http://localhost:3000/images/${userName === messageList.author
                                                                                ? messageList.authorImage
                                                                                : image
                                                                            }`
                                                                            : URL.createObjectURL(
                                                                                userName === messageList.author
                                                                                    ? messageList.authorImage
                                                                                    : image
                                                                            )
                                                                    }
                                                                    alt="Avatar"
                                                                    class="img-fluid my-5"
                                                                    style={{ width: "50px", height: "50px" }}
                                                                />
                                                            )}
                                                            <p>{messageList.message}</p>
                                                            <span className="time_date">{messageList.time}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })} */}

                                        {showMessage.length > 0 &&
                                            showMessage.map((messageList, index) => {
                                                console.log(messageList);
                                                // const isLastMessage =
                                                //     index === showMessage.length - 1 ||
                                                //     messageList.author !== showMessage[index + 1]?.author;

                                                return (
                                                    <div
                                                        key={messageList.id}
                                                        className={
                                                            userName === messageList.author ? "outgoing_msg" : "received_msg"
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                userName === messageList.author ? `${sentMessage}` : `${receivedMessage}`
                                                            }
                                                            key={messageList.id}
                                                        >
                                                            <div style={{ display: 'grid' }}>
                                                                {/* {isLastMessage && (
                                                                    
                                                                )} */}
                                                                <img
                                                                    src={
                                                                        typeof messageList.image === "string" ||
                                                                            !(messageList.image instanceof Blob)
                                                                            ? `http://localhost:3000/images/${userName === messageList.author
                                                                                ? messageList.authorImage
                                                                                : image
                                                                            }`
                                                                            : URL.createObjectURL(
                                                                                userName === messageList.author
                                                                                    ? messageList.authorImage
                                                                                    : image
                                                                            )
                                                                    }
                                                                    alt="Avatar"
                                                                    className="rounded-circle mr-1"
                                                                    style={{ width: "50px", height: "50px" }}
                                                                />
                                                                <span className="text-white small text-nowrap mt-2">{messageList.time}</span>
                                                            </div>
                                                            <div className={
                                                                userName === messageList.author ? "flex-shrink-1 bg-light rounded py-2 px-3 mr-3" : "flex-shrink-1 bg-light rounded py-2 px-3 ml-3"
                                                            } style={{ height: '20%', marginTop: '7px' }}>
                                                                <div class="font-weight-bold mb-1 text-muted">{(receiverId === messageList.receiverId) ? `${messageList.author}` : `${messageList.author}`}</div>
                                                                {messageList.message}
                                                            </div>


                                                        </div>
                                                    </div>
                                                );
                                            })}

                                    </div>

                                </div>
                                <div className="type_msg">
                                    <div className="input_msg_write">
                                        <input type="text" className="write_msg" onKeyUp={(e) => { e.key === "Enter" && sendMessage() }} placeholder="Type a message" value={message} onChange={(e) => { setMessage(e.target.value) }} />
                                        <button className="msg_send_btn" type="button" onClick={sendMessage}><AiOutlineSend className="send-icon" /></button>
                                        {/* <ToastContainer autoClose={1500} /> */}
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
