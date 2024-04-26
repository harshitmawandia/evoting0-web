import React from 'react';
import axios from 'axios';
import { ReactSession } from 'react-client-session';

const EquivalanceCheck = () => {

    const [votedFor, setVotedFor] = React.useState("");
    const [c_v, setC_V] = React.useState({ C_vX: 0, C_vX: 0 });
    const [c_rid_x, setC_rid_x] = React.useState("");
    const [c_rid_y, setC_rid_y] = React.useState("");
    ReactSession.setStoreType('sessionStorage');
    const access_token = ReactSession.get('access_token');

    const checkEquivalance = () => {
        axios.post(`http://${process.env.REACT_APP_DOMAIN}/api/admin/vote/check`, { C_ridX: c_rid_x, C_ridY: c_rid_y }, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        }).then((res) => {
            console.log(res.data);
            setVotedFor(res.data.name);
            setC_V({ C_vX: res.data.C_vX, C_vY: res.data.C_vY });
        }
        ).catch((err) => {
            console.log(err.response.data.error);
            alert(err.response.data.error);
        });
    }


    return (
        <div className='equivalance-check-container'>
            <h1>Equivalance Check</h1>
            <p>Enter C_rid<sub>x</sub></p>
            <input type='text' style={{ width: '50%' }} onChange={(e) => setC_rid_x(e.target.value)} />
            <p>Enter C_rid<sub>y</sub></p>
            <input type='text' style={{ width: '50%' }} onChange={(e) => setC_rid_y(e.target.value)} />
            <button style={{ margin: '30px', width: '200px' }} onClick={checkEquivalance}>Check Equivalance</button>
            <p> Voted For: {votedFor}</p>
            <p> C_v: ({c_v.C_vX}, {c_v.C_vY})</p>
        </div>
    )
}

export default EquivalanceCheck;