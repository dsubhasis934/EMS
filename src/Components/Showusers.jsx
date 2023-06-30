import React, { useEffect, useState, useCallback, useContext } from 'react'
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import { AiOutlineUserDelete } from 'react-icons/ai'
import { FaUserEdit } from 'react-icons/fa'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useSWR from 'swr'
import Users from './Users';
import { Audio } from 'react-loader-spinner'
import Home from './Home';
function Showusers({ socket }) {
    const loggedinUser = useContext(Home);
    const notify = () => toast.success("User Successfully Deleted");
    //const [messageReceived, setMessageReceived] = useState("");
    const [loading, setLoading] = useState(false);
    const [loginUserId, setLoginUserId] = useState('');
    const [show, setShow] = useState(false);
    const [userType, setUserType] = useState("");
    const [fieldvalue, setFieldvalue] = useState({ field: "name" });
    const [changesort, setchangesort] = useState('asc');
    const [userData, setUserdata] = useState([]);
    const [id, setId] = useState('');
    const getToken = localStorage.getItem("token");
    const findToken = JSON.parse(getToken)
    const { tok } = findToken
    const navigate = useNavigate();

    // const handleClose = () => {
    //     setId("");
    //     if (show) {
    //         setShow(false);
    //     } else {
    //         setShow(true)
    //     }
    // }

    const fetcher = async (url) => await axios.get(url, { headers: { Authorization: `Bearer ${tok}` } })
        .then(responses => responses.data)


    const loadUserdata = async () => {
        // await axios.get(`http://localhost:3000/api/showusers?sort=${changesort}&field=${fieldvalue.field}`, { headers: { Authorization: `Bearer ${gettoken}` } }).then(resp => { //in get function we dontneed to send any array or object because we can't store anything with get method,but we need to pass headers if we set jwt
        //     const { success, message, data, loginuser } = resp.data;
        //     //console.log(data);
        //     const { user_type } = loginuser;
        //     setUserType(user_type);
        //     // console.log(user_type);
        //     if (success) {
        //         //alert(message);
        //         setUserdata(data);
        //         //console.log(userData); if we do this it show us null value cause we store first empty array in userdata.
        //         //console.log(data);
        //     } else {
        //         alert(message)
        //     }
        // }).catch(cat => { alert(cat) });

    }

    const { data, error, isLoading } = useSWR(`http://localhost:3000/api/showusers?sort=${changesort}&field=${fieldvalue.field}`, fetcher)
    useEffect(() => {
        if (data) {
            const { loginuser } = data;
            console.log(data);
            setUserType(loginuser.user_type);
            setUserdata(data.data);
            setLoading(isLoading);
            setLoginUserId(loginuser._id);
        }
    }, [data, isLoading, changesort, fieldvalue.field]);

    if (error) {
        alert("error");
    }
    useEffect(() => {
        if (id !== '') {
            setShow(true);
        }
    }, [id])

    const changesortMethod = () => {
        if (changesort == 'asc') {
            setchangesort('dec');
        } else {
            setchangesort('asc')
        }

    }

    const saveAndClose = () => {
        axios.post("http://localhost:3000/api/deleteusers", { id: id }, { headers: { Authorization: `Bearer ${gettoken}` } })
            .then(
                res => {
                    const { success, message } = res.data;
                    if (success) {
                        const deleted = userData.filter(({ _id }) => {
                            return (
                                id !== _id
                            )
                        })
                        setUserdata(deleted);
                        setId('');
                        notify();
                    }

                }
            ).catch(cat => { console.log(cat.message) })
        console.log("user deleted");


        //we always set header asa last parameter


    }

    const changeDisplay = (fieldname, sortType) => {
        setFieldvalue({ field: fieldname });
        setchangesort(sortType);
    }
    useEffect(() => {
        socket.emit("user-connect", findToken.id);
    }, [])
    // useEffect(() => {
    //     socket.on("received_data", (data) => {
    //         console.log(data);
    //         if (findToken.id == data.receiverId) {
    //             alert("message recived");
    //         }

    //     })


    // }, [socket])

    return (
        <>
            {loggedinUser && loggedinUser.map((elem, id) => {
                console.log(elem)
            })}

            <table className="table">
                <thead className='table-danger'>
                    <tr>
                        <th scope="col" value="name">Name
                            {(fieldvalue.field == 'email' || fieldvalue.field == 'name' && changesort == 'dec') && <button className="up-arrow" onClick={() => changeDisplay('name', 'asc')}>&#x2191;</button>}
                            {(fieldvalue.field == 'email' || fieldvalue.field == 'name' && changesort == 'asc') && <button className="down-arrow" onClick={() => changeDisplay('name', 'dec')}>&#x2193;</button>}

                        </th>
                        <th scope="col">Email
                            {(fieldvalue.field == 'name' || fieldvalue.field == 'email' && changesort == 'dec') && <button className="up-arrow" onClick={() => changeDisplay('email', 'asc')}>&#x2191;</button>}
                            {(fieldvalue.field == 'name' || fieldvalue.field == 'email' && changesort == 'asc') && <button className="down-arrow" onClick={() => changeDisplay('email', 'dec')}>&#x2193;</button>}
                        </th>
                        <th scope="col" className="action-row">Delete</th>
                        <th scope="col" className="action-row">Update</th>
                        <th scope="col" className="action-row">Message</th>
                        <th scope="col" className="action-row">Status</th>
                    </tr>
                </thead>
                <tbody>

                    {
                        // data && data.map((elem) => {
                        //     const { _id, name, email } = elem;
                        //     return (
                        //         <>

                        //             <tr className="table-primary" key={_id}>
                        //                 <td>{name}</td>
                        //                 <td className="fw-bolder">{email}</td>
                        //                 <td>{userType === "admin" && <button className="deleteButton btn btn-danger text-white" onClick={() => setId(_id)}><AiOutlineUserDelete className="deleteIcon fs-5" /></button>}</td>
                        //                 <td><button className="updateButton btn btn-primary text-white " onClick={() => updateuser(_id)}><FaUserEdit className="updateIcon fs-5" /></button></td>
                        //             </tr>
                        //             <ToastContainer autoClose={1500} />

                        //         </>
                        //     )
                        // })
                        loading ? <Audio
                            height="80"
                            width="80"
                            radius="9"
                            color='green'
                            ariaLabel='three-dots-loading'
                            wrapperStyle
                            wrapperClass
                        /> : <Users data={userData} userType={userType} socket={socket} loginUserId={loginUserId} />
                    }
                </tbody>
            </table>
            {/* <button onClick={changesortMethod} className="sort-button">click here to {(changesort === 'asc') ? 'decending' : 'asecending'} </button><br /> */}



        </>
    )
}

export default Showusers
