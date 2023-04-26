import React from 'react';
import { ReactSession } from 'react-client-session';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const initialValues = {
    otp : '',
};

function EnterOTP() {
	// clear the local storage
	ReactSession.setStoreType('sessionStorage');

	const navigate = useNavigate();

	const loginSchema = Yup.object().shape({
        otp: Yup.string().required('OTP is required').min(4, 'OTP must be 4 digits').max(4, 'OTP must be 4 digits'),
	});

	const [data, setData] = React.useState(initialValues);

	const { values, errors, touched, handleBlur, handleSubmit, handleChange } = useFormik({
		initialValues: data,
		validationSchema: loginSchema,

		onSubmit: (values) => {
            const my_otp = values.otp;
            const token = ReactSession.get('access_token');
			axios.get(
                "http://10.17.6.59/api/admin/voter/otp",
                {
                    params: {
                        "otp": my_otp,
                    },
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            ).then((res) => {
                console.log(res.data);
                ReactSession.set('otp', my_otp);
                navigate('/eligible_elections', { replace: true });
            }).catch((err) => {
                console.log(err);
                alert(err.response.data.error);
            })
		},
	});

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<div class='imgcontainer'>
					<h1>ENTER OTP</h1>
				</div>

				<div class='container'>
					<label for='otp'>
						<b>OTP</b>
					</label>

					<input type='text' placeholder='Enter OTP' name='otp' required onChange={handleChange} value={values.otp} onBlur={handleBlur} autoComplete='off' />
                    {errors.otp && touched.otp ? <div>{errors.otp}</div> : null}

					<button type='submit'>
						Login
					</button>
				</div>
			</form>
		</div>
	);
}

export default EnterOTP;