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

function POLogin() {
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
				.post('http://10.17.5.54:8000/api/admin/login', { username: my_username, password: my_password })
				.then((res) => {
					const access_token = res.data.access;
					console.log(access_token);
					ReactSession.set('access_token', access_token);
					navigate('/generate_token', { replace: true });
				})
				.catch((err) => {
					console.log(err.response.data.error);
					alert(err.response.data.error);
				});
		},
	});

	const logout = () => {
		ReactSession.set('access_token', null);
		navigate('/', { replace: true });
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<div class='imgcontainer'>
					<h1>POLLING OFFICER LOGIN</h1>
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

			<button style={{ margin: '30px', width: '200px' }} onClick={logout}>
				Logout
			</button>
		</div>
	);
}

export default POLogin;
