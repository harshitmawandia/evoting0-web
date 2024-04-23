import React from 'react';
import { ReactSession } from 'react-client-session';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const initialValues = {
    entryNumber : '',
};

function GenerateToken() {
	// clear the local storage
	ReactSession.setStoreType('sessionStorage');
	ReactSession.set('otp', null);
	ReactSession.set('elections', null);

	const [disabled, setDisabled] = React.useState(false);


	const loginSchema = Yup.object().shape({
        entryNumber: Yup.string().required('Entry Number is required').min(11, 'Entry Number must be 11 digits').max(11, 'Entry Number must be 11 digits'),
	});

	const [data, setData] = React.useState(initialValues);

	const { values, errors, touched, handleBlur, handleSubmit, handleChange } = useFormik({
		initialValues: data,
		validationSchema: loginSchema,

		onSubmit: (values) => {
			// disable the button
			setDisabled(true);
			
            const my_entryNumber = values.entryNumber;
            const token = ReactSession.get('access_token');
			if (token === null || token === undefined) {
				alert("Please login first");
				navigate('/', { replace: true });
				return;
			}
            console.log(token);
			axios.get(
                "http://127.0.0.1:8000/api/admin/voter/token",
                {
                    params: {
                        "entryNumber": my_entryNumber,
                    },
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            ).then((res) => {
                console.log(res.data);
                alert("Token Generated Successfully\nOTP: "+res.data.data.otp+"\nBooth ID: "+res.data.data.booth);
                // reload window after 1 second
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }).catch((err) => {
                console.log(err.response);
                alert(err.response.data.error);
				// enable the button
				setDisabled(false);
            })
		},
	});

    const navigate = useNavigate();

    const logout = () => {
        ReactSession.set('access_token', null);
        navigate('/', { replace: true });
    }

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<div class='imgcontainer'>
					<h1>GENERATE TOKEN</h1>
				</div>

				<div class='container'>
					<label for='entryNumber'>
						<b>Entry Number</b>
					</label>

					<input type='text' placeholder='Entery Number' name='entryNumber' value={values.entryNumber} onChange={handleChange} onBlur={handleBlur} autoComplete='off' />
                    {touched.entryNumber && errors.entryNumber ? <div>{errors.entryNumber}</div> : null}

					<button type='submit' disabled={disabled} style={{ margin: '30px', width: '200px' }}>
						Generate
					</button>
				</div>
			</form>
            <button style={{ margin: '30px', width: '200px' }} type='button' onClick={logout}>
				Logout
			</button>
		</div>
	);
}

export default GenerateToken;