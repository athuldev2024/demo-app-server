const URL = 'http://localhost:3000/users';

document.getElementById('register') &&
	document.getElementById('register').addEventListener('click', registerUser);
document.getElementById('login') &&
	document.getElementById('login').addEventListener('click', loginUser);
document.getElementById('edit') &&
	document.getElementById('edit').addEventListener('click', editUser);

async function registerUser(event) {
	try {
		event.preventDefault();
		const name = document.getElementById('name').value;
		const dob = document.getElementById('dob').value;
		const password = document.getElementById('password').value;
		const confirm = document.getElementById('confirm').value;
		const genderArr = document.getElementsByName('gender');
		let gender;
		for (let inc = 0; inc < genderArr.length; inc++) {
			if (genderArr[inc].checked) {
				gender = genderArr[inc].value;
			}
		}

		if (!name || !dob || !password || !confirm || !gender) {
			alert('Enter all details before registering!!');
			return;
		} else {
			if (password !== confirm) {
				alert('Password and confirm password dont match!!');
			}

			const res = await fetch(`${URL}/register`, {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify({ name, password, confirm, dob, gender }),
			});

			if (res.status === 201) {
				window.location.href = `http://localhost:3000/view`;
			} else {
				throw Error('Error occured while registering!!');
			}
		}
	} catch (error) {
		alert(error?.message);
	}
}

async function loginUser(event) {
	try {
		event.preventDefault();
		const name = document.getElementById('name').value;
		const password = document.getElementById('password').value;

		if (!name || !password) {
			alert('Enter all details before logging in!!');
			return;
		} else {
			const res = await fetch(`${URL}/login`, {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify({ name, password }),
			});

			if (res.status === 200) {
				window.location.href = `http://localhost:3000/view`;
			} else {
				throw Error('Error while logging in!!');
			}
		}
	} catch (error) {
		alert(error?.message);
	}
}

function editThisUser(name) {
	window.location.href = `http://localhost:3000/edit/${name}`;
}

async function deleteUser(name) {
	try {
		const res = await fetch(`${URL}/delete/${name}`, {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			method: 'DELETE',
		});

		if (res.status === 204) {
			location.reload();
		}
	} catch (error) {
		alert(error?.message);
	}
}

async function editUser(event) {
	try {
		console.log('i have rwached here!!!');
		event.preventDefault();
		const name = document.URL.split('/')[document.URL.split('/').length - 1];
		const dob = document.getElementById('dob').value;
		const password = document.getElementById('password').value;
		const confirm = document.getElementById('confirm').value;
		const genderArr = document.getElementsByName('gender');
		let gender;
		for (let inc = 0; inc < genderArr.length; inc++) {
			if (genderArr[inc].checked) {
				gender = genderArr[inc].value;
			}
		}

		if (!dob || !password || !confirm || !gender) {
			alert('Enter all details before registering!!');
			return;
		} else {
			console.log(password);
			console.log(confirm);
			console.log(dob);

			if (password !== confirm) {
				alert('Password and confirm password dont match!!');
			}

			const res = await fetch(`${URL}/update`, {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				method: 'PATCH',
				body: JSON.stringify({ name, password, confirm, dob, gender }),
			});

			if (res.status === 200) {
				alert('User has been registered!!');
			} else {
				throw Error('Error occured while registering!!');
			}
		}
	} catch (error) {
		alert(error?.message);
	}
}

const logoutUser = async () => {
	try {
		const res = await fetch(`${URL}/logout`, {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			method: 'GET',
		});

		if (res.status === 200) {
			window.location.href = `http://localhost:3000/login`;
		} else {
			throw Error('Error occured while registering!!');
		}
	} catch (error) {
		alert(error?.message);
	}
};
