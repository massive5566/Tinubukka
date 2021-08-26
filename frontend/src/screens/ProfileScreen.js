import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Spinner from '../components/Spinner';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { listUserOrders } from '../actions/orderActions';
import { LinkContainer } from 'react-router-bootstrap';

const ProfileScreen = ({ location, history }) => {
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');
	const [confirmpassword, setConfirmPassword] = useState('');
	const [message, setMessage] = useState('');
	const dispatch = useDispatch();

	const userDetails = useSelector(state => state.userDetails);
	const { loading, error, user } = userDetails;

	const userLogin = useSelector(state => state.userLogin);
	const { userInfo } = userLogin;

	const userUpdateProfile = useSelector(state => state.userUpdateProfile);
	const { success } = userUpdateProfile;

	const orderListByUser = useSelector(state => state.orderListByUser);
	const {
		loading: loadingOrders,
		orders,
		error: errorOrders,
	} = orderListByUser;

	useEffect(() => {
		if (!userInfo) {
			history.push('/login');
		} else {
			if (!user || !user.name || success) {
				dispatch(getUserDetails('profile'));
				dispatch(listUserOrders());
			} else {
				setName(user.name);
				setEmail(user.email);
			}
		}
	}, [dispatch, history, userInfo, user, success]);

	const submitHandler = e => {
		e.preventDefault();
		if (confirmpassword !== password) {
			setMessage('Passwords do not match ');
		} else {
			// Dispatch Update profile
			dispatch(updateUserProfile({ id: user._id, name, email, password }));
		}
	};
	return (
		<Row>
			<Col md={3}>
				<h2>User Profile</h2>
				{message && <Message variant='danger' children={message} />}
				{error && <Message variant='danger' children={error} />}
				{success && <Message variant='success' children='Profile updated' />}
				{loading && <Spinner />}
				<Form onSubmit={submitHandler}>
					<Form.Group controlId='name'>
						<Form.Label>Name</Form.Label>
						<Form.Control
							type='name'
							placeholder='Enter Name'
							value={name}
							onChange={e => setName(e.target.value)}
						></Form.Control>
					</Form.Group>
					<Form.Group controlId='email'>
						<Form.Label>Email Address</Form.Label>
						<Form.Control
							type='email'
							placeholder='Enter Email'
							value={email}
							onChange={e => setEmail(e.target.value)}
						></Form.Control>
					</Form.Group>
					<Form.Group controlId='password'>
						<Form.Label>Password </Form.Label>
						<Form.Control
							type='password'
							placeholder='Enter Password'
							value={password}
							onChange={e => setPassword(e.target.value)}
						></Form.Control>
					</Form.Group>
					<Form.Group controlId='confirmPassword'>
						<Form.Label>Confirm Password </Form.Label>
						<Form.Control
							type='password'
							placeholder='Confirm Password'
							value={confirmpassword}
							onChange={e => setConfirmPassword(e.target.value)}
						></Form.Control>
					</Form.Group>
					<Button type='submit' variant='primary'>
						Update
					</Button>
				</Form>
			</Col>
			<Col md={9}>
				<h2>My Orders</h2>
				{loadingOrders ? (
					<Spinner />
				) : errorOrders ? (
					<Message variant='danger' children={errorOrders} />
				) : (
					<Table striped bordered hover responsive className='table-sm'>
						<thead>
							<tr>
								<th>ID</th>
								<th>DATE</th>
								<th>TOTAL</th>
								<th>PAID</th>
								<th>DELIVERED</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{orders.map(order => (
								<tr key={order._id}>
									<td>{order._id}</td>
									<td>{order.createdAt.substring(0, 10)}</td>
									<td>{order.totalPrice}</td>
									<td>
										{order.isPaid ? (
											order.paidAt.substring(0, 10)
										) : (
											<i className='fas fa-times' style={{ color: 'red' }} />
										)}
									</td>
									<td>
										{order.isDelivered ? (
											order.deliveredAt.substring(0, 10)
										) : (
											<i className='fas fa-times' style={{ color: 'red' }} />
										)}
									</td>
									<td>
										<LinkContainer to={`/order/${order._id}`}>
											<Button variant='light' className='btn-sm'>
												Details
											</Button>
										</LinkContainer>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				)}
			</Col>
		</Row>
	);
};

export default ProfileScreen;
