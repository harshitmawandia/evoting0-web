import React from 'react';
import { ReactSession } from 'react-client-session';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {useEffect} from 'react';


function BallotPage() {
	// clear the local storage
	ReactSession.setStoreType('sessionStorage');
    const token = ReactSession.get('access_token');
    const otp = ReactSession.get('otp');
    const elections = ReactSession.get('elections');


	// ReactSession.set('elections', null);

	const navigate = useNavigate(); 
    const [C_rid, setC_rid] = React.useState(null);
    const [C_u,setC_u] = React.useState(null);
    const [u,setU] = React.useState(null);
    const [numVotes, setNumVotes] = React.useState(0);
    const [numCandidates, setNumCandidates] = React.useState(0);
    const [ballotList, setBallotList] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [currentElection, setCurrentElection] = React.useState(null);


    // on page load, get the elections that the user is eligible for
    useEffect(() => {
        console.log(elections);

        // if(token == null){
        //     alert('Please login first');
        //     navigate('/booth_login', { replace: true });
        // }
        // if(otp == null){
        //     alert('Please enter OTP first');
        //     navigate('/enter_otp', { replace: true });
        // }
        // if(elections == null){
        //     alert('No elections found');
        //     navigate('/eligible_elections', { replace: true });
        // }
        // if(elections.length === 0){
        //     alert('No elections found');
        //     navigate('/enter_otp', { replace: true });
        // }

        // get the current election
        setCurrentElection(elections[0]);
        var current = elections[0];

        axios.get('http://10.17.6.59/api/admin/voter/ballot',
            {
                params:{
                    otp: otp,
                    voter_id: current.voterId,
                },
                headers:{
                    'Authorization': 'Bearer ' + token
                }
            }
        ).then((res)=>{
            // console.log(res.data);
            setC_rid(res.data.C_ridX + ',' + res.data.C_ridY);
            setC_u([res.data.C_uX, res.data.C_uY].join(','));
            setU(res.data.u);
            setNumVotes(res.data.numVotes);

            var ballotListTemp = res.data.ballotlist;
            // console.log(ballotListTemp);
            // sort the ballot list randomly
            ballotListTemp.sort(() => Math.random() - 0.5);
            setBallotList(ballotListTemp);
        }
        ).catch((err)=>{
            console.log(err);
            ReactSession.set('otp', null);
            ReactSession.set('elections', null);
            alert(err.response.data.error);
            // move back to otp page
            navigate('/enter_otp', { replace: true });
        })

        setLoading(false);
        
    }, []);

    // on checkbox click, update the number of votes

    const handleChange = (event) => {
        var numVotesTemp = numCandidates;
        var checkboxes = document.getElementsByTagName('input');
        if(event.target.checked){
            numVotesTemp++;
            console.log(numVotesTemp);
            console.log(numVotes);
        
            if(numVotesTemp >= numVotes){
                // console.log('max votes reached');
                // disable all other checkboxes
                // console.log(checkboxes.length);
                for (var i = 0; i < checkboxes.length; i++) {
                    // console.log(checkboxes[i].checked);
                    if(checkboxes[i].checked === false){
                        checkboxes[i].disabled = true;
                    }
                }
            }
        }else{
            numVotesTemp--;
            if(numVotesTemp < numVotes){
                // enable all other checkboxes
                for (i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].disabled = false;
                }
            }
        }

        setNumCandidates(numVotesTemp);

        // enable cast vote button
        if(numVotesTemp === numVotes){
            document.getElementById('castVoteButton').disabled = false;
            console.log('enable cast vote button');
            console.log(document.getElementById('castVoteButton').disabled);
        }else{
            document.getElementById('castVoteButton').disabled = true;
        }

    }

    const castVote = () => {
        var selectedCheckbox = document.querySelectorAll('input[type=checkbox]:checked');
        console.log(selectedCheckbox);
        var selectedIds = Array.from(selectedCheckbox).map(cb => cb.id);
        console.log(selectedIds);

        const modal = document.createElement('div');
        modal.classList.add('modal');
        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');
        const modalText = document.createElement('p');
        modalText.innerText = 'Are you sure you want to submit your vote?';
        const confirmButton = document.createElement('button');
        confirmButton.innerText = 'Yes';
        const cancelButton = document.createElement('button');
        cancelButton.innerText = 'Cancel';
        cancelButton.style.backgroundColor = 'red';

        // on clicking confirm button
        confirmButton.addEventListener('click', ()=>{
            var intOfSelectedIds = selectedIds.map((id) => parseInt(id));

            let data = {
                "otp": otp,
                "voter_id": currentElection.voterId,
                "vote_list": intOfSelectedIds
            }
            axios.post('http://10.17.6.59/api/admin/voter/vote',
                data,
                {
                    headers:{
                        'Authorization': 'Bearer ' + token
                    }
                }
            ).then((res)=>{
                console.log(res.data);
                // delete current election from elections
                var remainingElections = elections.slice(1);
                if (remainingElections.length === 0) {
                    localStorage.removeItem('elections');
                    localStorage.removeItem('otp');
                    alert('You have completed voting! Thank you for voting!');
                    window.location.replace('/enter_otp');
                } else {
                    localStorage.setItem('elections', remainingElections);
                    alert('You have completed voting for ' + currentElection.election + ' elections! You will now be redirected to the next election.');
                    window.location.reload();
                }
            }).catch((err)=>{
                console.log(err);
                localStorage.removeItem('elections');
                localStorage.removeItem('otp');
                alert(err.response.data.error);
                window.location.replace('/enter_otp');
            });
            

            console.log('confirmed');
            modal.style.display = 'none';
        });

        // on clicking cancel button
        cancelButton.addEventListener('click', ()=>{
            modal.style.display = 'none';
        });

        modalContent.appendChild(modalText);
        modalContent.appendChild(confirmButton);
        modalContent.appendChild(cancelButton);
        modal.appendChild(modalContent);
        document.getElementsByClassName('App')[0].appendChild(modal);

        modal.style.display = 'block';

    }


    
	

	return (
        loading === true ? <div >Loading...</div> :

		<div>
            <div class="imgcontainer">
                <h1> {currentElection.election + ' Elections'} </h1>
            </div>

            <div class="heard-div" style={{margin: '30px 10%', marginBottom: '0px', textAlign: 'center', width: '80%', display: 'flex', 'flexDirection': 'row', justifyContent: 'space-evenly', alignItems: 'center'}}>
                <div class="qr-div" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <h3>Verification Data</h3>
                    <img width="100px" height="100px" src={"https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=C_rid:" + C_rid + ",C_u:" + C_u + ",u:" + u + "'"} alt="qr code"/>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <h3>Number Of Votes=<span id="numVotes">{numVotes}</span></h3>
                    <h3>Candidates Selected=<span id="numCandidates">{numCandidates}</span></h3>
                </div>
            </div>

            <div id="candidates" class="container">
                {
                    ballotList.map((candidate, index) => {return(
                    <div class="container" style={{marginLeft: '30px'}}>
                        <div class = "row justify-content-space-around align-items-center">
                            <div class ="col-1" style={{alignItems: 'center'}}>
                                <input type="checkbox" style={{width:'18px', height:'18px'}} name={"checkbox"+index} id={candidate.j} value={candidate.j} onClick={handleChange}/>
                            </div>
                            <div class ="col-10">
                                {"Name: "+candidate.name}
                                <br/>
                                {"ID: "+candidate.j}
                            </div>
                        </div>
                    </div>
                    )})
                }

            </div>

            <button type="button" id="castVoteButton" style={{margin: '0 40%', marginBottom: '30px', width: '20%', minWidth: '150px'}} onClick={castVote}>Cast Vote</button>

        </div>
	);
}

export default BallotPage;