import React from 'react';
import { ReactSession } from 'react-client-session';
import { useNavigate, useLocation } from 'react-router-dom';

function Home() {
	// clear the local storage
	ReactSession.setStoreType('sessionStorage');
	ReactSession.set('access_token', null);
	ReactSession.set('otp', null);
	ReactSession.set('elections', null);

	const navigate = useNavigate();

	return (
		<div>
			<div class='imgcontainer'>
				<h1>Welcome to CAIC E-Voting Portal</h1>
			</div>

			<div class='container' style={{ textAlign: 'center' }}>
				<button
					style={{ margin: '30px', width: '200px' }}
					type='button'
					onClick={() => {
            document.documentElement.requestFullscreen();
						navigate('/booth_login', { replace: true });
					}}
				>
					Booth Login
				</button>
				<br />
				<button
					style={{ margin: '30px', width: '200px' }}
					type='button'
					onClick={() => {
						navigate('/po_login', { replace: true });
					}}
				>
					PO Login
				</button>
				<br />
				<button
					style={{ margin: '30px', width: '200px' }}
					type='button'
					onClick={() => {
						navigate('/admin_login', { replace: true });
					}}
				>
					Admin Login
				</button>
			</div>
		</div>
	);
}

export default Home;
