import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { AiOutlineUserDelete } from 'react-icons/ai'
import { FaUserEdit } from 'react-icons/fa'
import { RiMessage2Fill } from 'react-icons/ri'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { RiRadioButtonLine } from 'react-icons/ri'
function Users({ data, userType, socket, loginUserId }) {
    const [userData, setUserData] = useState([]);
    const [userListData, setUserListData] = useState([]);
    const getToken = localStorage.getItem("token");
    const findToken = JSON.parse(getToken)
    //const { name } = findToken
    const notify = () => toast.success("User Successfully Deleted");
    const [id, setId] = useState('');
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        socket.on("user_List", (data) => {
            console.log(data);
            setUserListData(data);
        })
    }, [userListData]);
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
        console.log(msgItem);
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
    // useEffect(() => {
    //     socket.on("received_data", (data) => {
    //         if (findToken.id === data.receiverId) {
    //             console.log("new notification");
    //         }

    //     },)

    // }, [socket])
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
                return (
                    <>

                        <tr className="table-primary" key={_id}>
                            <td>{name}</td>
                            <td className="fw-bolder">{email}</td>
                            <td>{userType === "admin" && <button className="deleteButton btn btn-danger text-white" onClick={() => setId(_id)}><AiOutlineUserDelete className="deleteIcon fs-5" /></button>}</td>
                            <td>{userType === "admin" && <button className="updateButton btn btn-primary text-white " onClick={() => updateuser(_id)}><FaUserEdit className="updateIcon fs-5" /></button>}</td>
                            <td> {!(loginUserId === _id) && <button className="updateButton btn btn-success text-white " onClick={() => forChat(_id, image)}><RiMessage2Fill className="updateIcon fs-5" /></button>}</td>
                            {/* includes functions check that id is already store in array or not */}
                            <td>{userListData.includes(_id) ? <p className="text-success"><RiRadioButtonLine /></p> : <p><RiRadioButtonLine /></p>}</td>

                        </tr>
                        <ToastContainer autoClose={1500} />

                    </>
                )
            })}
        </>

    )
}

export default Users
