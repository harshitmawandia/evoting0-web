import React from 'react';
import { ReactSession } from 'react-client-session';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const initialValues = {
	username: '',
	password: '',
};

function BoothLogin() {
	// clear the local storage
	ReactSession.setStoreType('sessionStorage');
	ReactSession.set('access_token', null);
	ReactSession.set('otp', null);
	ReactSession.set('elections', null);

	const navigate = useNavigate();

	const loginSchema = Yup.object().shape({
		username: Yup.string().required('Username is required'),
		password: Yup.string().required('Password is required'),
	});

	const [data, setData] = React.useState(initialValues);

	const { values, errors, touched, handleBlur, handleSubmit, handleChange } = useFormik({
		initialValues: data,
		validationSchema: loginSchema,

		onSubmit: (values) => {
			const my_username = values.username;
			const my_password = values.password;
			axios
				.post('http://127.0.0.1:8000/api/admin/registerBooth', { username: my_username, password: my_password })
				.then((res) => {
					const access_token = res.data.token.access;
					console.log(access_token);
					ReactSession.set('access_token', access_token);
					navigate('/enter_otp', { replace: true });
				})
				.catch((err) => {
					alert(err.response.data.error);
					console.log(err);
				});
		},
	});

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<div class='imgcontainer'>
					<h1>REGISTER/LOGIN BOOTH</h1>
				</div>

				<div class='container'>
					<label for='username'>
						<b>Username</b>
					</label>

					<input
						type='text'
						placeholder='Enter Username'
						name='username'
						value={values.username}
						onChange={handleChange}
						onBlur={handleBlur}
						id='username'
						autoComplete='off'
					/>
					{errors.username && touched.username ? <div>{errors.username}</div> : null}

					<label for='password'>
						<b>Password</b>
					</label>

					<input
						type='password'
						placeholder='Enter Password'
						name='password'
						value={values.password}
						onChange={handleChange}
						onBlur={handleBlur}
						id='password'
						autoComplete='off'
					/>
					{errors.password && touched.password ? <div>{errors.password}</div> : null}

					<button type='submit'>Login</button>
				</div>
			</form>

			<button style={{ margin: '30px', width: '200px' }} type='button' onclick='logout()'>
				Logout
			</button>
		</div>
	);
}

export default BoothLogin;
