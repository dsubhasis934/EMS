import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { AiFillDelete, AiOutlineDelete, AiOutlineUserDelete } from 'react-icons/ai'
import { FaUserEdit } from 'react-icons/fa'
import { RiMessage2Fill } from 'react-icons/ri'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { RiRadioButtonLine } from 'react-icons/ri'
import { Mail } from '@mui/icons-material'
import { Badge } from '@mui/material'
import MailIcon from '@mui/icons-material/Mail'
import { GrStatusCriticalSmall } from 'react-icons/gr'
import Radio from '@mui/material/Radio';
// import { IoRadioButtonOff } from 'react-icons/io'
import FormControlLabel from '@mui/material/FormControlLabel';
// import { IoRadioButtonOnOutline } from 'react-icons/io'
function Users({ data, userType, socket, loginUserId }) {
    const [userData, setUserData] = useState([]);
    const [userListData, setUserListData] = useState([]);
    const getToken = localStorage.getItem("token");
    const findToken = JSON.parse(getToken)
    //const { name } = findToken
    const notify = () => toast.success("User Successfully Deleted", { autoClose: 1200 });
    const [id, setId] = useState('');
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const [takeId, setTakeId] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0)
    useEffect(() => {
        socket.emit("user-connect", findToken.id);
    }, [socket])
    useEffect(() => {
        socket.on("user_List", (data) => {
            // console.log(data);
            setUserListData(data);
        })
    }, [userListData, takeId]);
    const handleClose = () => {
        setId("");
        if (show) {
            setShow(false);
        } else {
            setShow(true)
        }
    }
    const updateuser = (userid) => {
        const editItem = userData.find(({ _id }) => {
            return (userid === _id)
        })
        navigate({
            pathname: `/signup/${editItem._id}`
        });


    }
    // const changeFieldValue = (e) => {
    //     setFieldvalue({ ...fieldvalue, [e.target.name]: e.target.value });
    // }
    useEffect(() => {
        if (id !== '') {
            setShow(true);
        }
    }, [id])
    useEffect(() => {
        setUserData(data);
    }, [data])
    const saveAndClose = () => {
        const { tok } = findToken
        axios.post("http://localhost:3000/api/deleteusers", { id: id },
            { headers: { Authorization: `Bearer ${tok}` } })
            .then(
                res => {
                    const { success, message } = res.data;
                    if (success) {

                        const deleted = userData.filter(({ _id }) => {
                            return (
                                id !== _id
                            )
                        })
                        setUserData(deleted);
                        setId('');
                        notify();
                    } else {
                        console.log(message);
                    }

                }
            ).catch(cat => { console.log("error occured") })


        //we always set header asa last parameter


    }
    // when we clicked chat icon this forChat function is called

    const forChat = (msgid, image) => {
        const msgItem = userData.find(({ _id }) => {
            return (msgid === _id)
        })
        // console.log(msgItem);
        const rmtext = msgItem.name.toLowerCase().split(" ").join("");
        const lowercaseName = findToken.name.toLowerCase();
        const mergeName = rmtext.concat(lowercaseName);
        const sortName = mergeName.split('').sort().join('');
        console.log(sortName);

        navigate({
            pathname: `/chat`,
            search: `?room=${sortName}&receiver=${msgItem.name}&receiverId=${msgItem._id}&image=${msgItem.image}`
        });



    }
    useEffect(() => {
        socket.on("notification", (notificationData) => {
            // console.log(notificationData)
            // Handle the notification, e.g., show a toast or update a notification state
            if (notificationData.data.receiverId == findToken.id) {
                toast.success(`message received by ${notificationData.data.author}`, { autoClose: 1200 });
                setTakeId([notificationData.data.authorId])
                setNotificationCount(prev => prev + 1)
            }
        });
        // console.log(typeof (takeId))
    }, [])
    return (
        <>
            {/* this modal is only displayed when we clicked deleted button */}
            <Modal show={id !== ""} onHide={handleClose}>
                <Modal.Header closeButton onClick={handleClose}>
                    <Modal.Title>Are you sure?</Modal.Title>
                </Modal.Header>
                {/* <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body> */}
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={saveAndClose}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
            {userData && userData.map((elem) => {
                // console.log(elem);
                const { _id, name, email, image } = elem;
                // console.log(takeId)
                const takingId = takeId.filter((id) => id === _id)

                // console.log(takingId)
                return (
                    <>

                        <tr key={_id}>
                            <td>{name}</td>
                            <td className="fw-bolder">{email}</td>
                            <td>{userType === "admin" && <button className="deleteButton btn text-white" style={{ backgroundColor: "red" }} onClick={() => setId(_id)}><AiFillDelete className="deleteIcon fs-5" /></button>}</td>
                            <td>{userType === "admin" && <button className="updateButton btn text-white " style={{ backgroundColor: "#ffd700" }} onClick={() => updateuser(_id)}><FaUserEdit className="updateIcon fs-5" /></button>}</td>
                            <td>
                                {!(loginUserId === _id) && (
                                    <button className="updateButton btn text-white " style={{ backgroundColor: "#5670ff" }} onClick={() => forChat(_id, image)}>
                                        {takeId.includes(_id) ? (<Badge color="error" badgeContent={notificationCount}>
                                            <MailIcon />
                                        </Badge>
                                        ) : (
                                            <MailIcon />
                                        )}
                                    </button>
                                )}
                            </td>
                            {/* includes functions check that id is already store in array or not */}
                            <td>{userListData.includes(_id) ? <p className="text-success" style={{ backgroundcolor: "green" }}><GrStatusCriticalSmall /></p> : <p><GrStatusCriticalSmall /></p>}</td>

                        </tr>
                        {/* <ToastContainer autoClose={1500} /> */}

                    </>
                )
            })}
        </>

    )
}

export default Users
