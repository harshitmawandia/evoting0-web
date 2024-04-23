import React from 'react';
import { ReactSession } from 'react-client-session';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {useEffect} from 'react';


function EligibleElections() {
	// clear the local storage
	ReactSession.setStoreType('sessionStorage');
	// ReactSession.set('elections', null);

	const navigate = useNavigate();
    const [elections, setElections] = React.useState([]); // elections that the user is eligible for [

    // on page load, get the elections that the user is eligible for
    useEffect(() => {
        const token = ReactSession.get('access_token');
        const otp = ReactSession.get('otp');

        if(token === null ||  token === undefined){
            alert('Please login first');
            navigate('/booth_login', { replace: true });
            return;
        }
        if(otp == null){
            navigate('/enter_otp', { replace: true });
            return;
        }

        axios.get('http://10.17.5.54:8000/api/admin/voter/elections', {
			params: {
				otp: otp
			},
			headers: {
				'Authorization': 'Bearer ' + token
			}
		}).then((res)=>{
			// console.log(res.data.data);
			setElections(res.data.data);
            ReactSession.set('elections', res.data.data);
            // console.log(elections);
		}).catch((err)=>{
			console.log(err);
			localStorage.removeItem('otp');
			alert(err.response.data.error);
            // move back to otp page
            navigate('/ballot_page', { replace: true });
		})
    }, []);

    // const arr = [
    //     {
    //         'name': 'election1',
    //         'votes': 100
    //     },
    //     {
    //         'name': 'election2',
    //         'votes': 200
    //     },
    // ]

    // console.log(arr)
	

	return (
		<div>
            <div class="imgcontainer">
                <h1>ELIGIBLE ELECTIONS</h1>
            </div>

            <div class="container mt-4">
                <table class="table">
                <thead>
                    <tr>
                        <th>Election Name</th>
                        <th>Number of Votes</th>
                    </tr>
                </thead>
                    <tbody id="results">
                        {/* check if elections is empty */}
                        {elections.length !== 0 ? elections.map((election, index) => {
                            return (
                                <tr key={index}>
                                    <td>{election.election}</td>
                                    <td>{election.numVotes}</td>
                                </tr>
                            )
                        }) : null}
                    </tbody>
                </table>
            </div>

            <button style={{maxWidth: '1320px'}} type="button" onClick={() => {navigate('/ballot_page', { replace: true })}}>VOTE</button>
		</div>
	);
}

export default EligibleElections;