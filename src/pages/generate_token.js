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


	const loginSchema = Yup.object().shape({
        entryNumber: Yup.string().required('Entry Number is required').min(11, 'Entry Number must be 11 digits').max(11, 'Entry Number must be 11 digits'),
	});

	const [data, setData] = React.useState(initialValues);

	const { values, errors, touched, handleBlur, handleSubmit, handleChange } = useFormik({
		initialValues: data,
		validationSchema: loginSchema,

		onSubmit: (values) => {
            const my_entryNumber = values.entryNumber;
            const token = ReactSession.get('access_token');
            console.log(token);
			axios.get(
                "http://10.17.6.59/api/admin/voter/token",
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

					<button type='submit'>
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