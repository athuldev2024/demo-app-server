const URL = "http://localhost:3000/users";
const NAV_URL = "http://localhost:3000/hbs";

document.getElementById("register") &&
  document.getElementById("register").addEventListener("click", registerUser);
document.getElementById("signInMove") &&
  document.getElementById("signInMove").addEventListener("click", signInMove);

document.getElementById("login") &&
  document.getElementById("login").addEventListener("click", loginUser);
document.getElementById("signUpMove") &&
  document.getElementById("signUpMove").addEventListener("click", signUpMove);

document.getElementById("deleteUser") &&
  document.getElementById("deleteUser").addEventListener("click", deleteUser);
document.getElementById("gotoEditUserPage") &&
  document
    .getElementById("gotoEditUserPage")
    .addEventListener("click", gotoEditUserPage);
document.getElementById("logoutUser") &&
  document.getElementById("logoutUser").addEventListener("click", logoutUser);

document.getElementById("update") &&
  document.getElementById("update").addEventListener("click", editUser);

document.getElementById("goToLoginPage") &&
  document
    .getElementById("goToLoginPage")
    .addEventListener("click", goToLoginPage);

function signUpMove() {
  window.location.href = `${NAV_URL}/register`;
}
async function loginUser(event) {
  try {
    event.preventDefault();
    const mobile = document.getElementById("mobile").value;
    const password = document.getElementById("password").value;

    if (!mobile || !password) {
      alert("Enter all details before logging in!!");
      return;
    } else {
      const res = await fetch(`${URL}/login`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ mobile, password }),
      });

      if (res.status === 200) {
        console.log("I have reacjhed her!!");
        console.log(res);
        const resJson = await res.json();
        console.log("resJson.userID=> ", resJson.userID);
        localStorage.setItem("userID", resJson.userID);
        window.location.href = `${NAV_URL}/view/${resJson.userID}`;
      } else if (res.status === 404) {
        alert("Wrong credentials!!");
      } else {
        throw Error("Error while logging in!!");
      }
    }
  } catch (error) {
    alert(error?.message);
  }
}

function signInMove() {
  window.location.href = `${NAV_URL}/login`;
}
async function registerUser(event) {
  try {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const dob = document.getElementById("dob").value;
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm").value;
    const mobile = document.getElementById("mobile").value;
    const email = document.getElementById("email").value;
    const genderArr = document.getElementsByName("gender");
    let gender;
    for (let inc = 0; inc < genderArr.length; inc++) {
      if (genderArr[inc].checked) {
        gender = genderArr[inc].value;
      }
    }

    if (
      !name ||
      !dob ||
      !password ||
      !confirm ||
      !gender ||
      !mobile ||
      !email
    ) {
      alert("Enter all details before registering!!");
      return;
    } else {
      if (password !== confirm) {
        alert("Password and confirm password dont match!!");
        return;
      }

      const res = await fetch(`${URL}/register`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ name, password, mobile, email, dob, gender }),
      });

      if (res.status === 201) {
        const resJson = await res.json();
        localStorage.setItem("userID", resJson.userID);
        window.location.href = `${NAV_URL}/view/${resJson.userID}`;
      } else if (res.status === 409) {
        alert("User already exists!!");
      } else {
        throw Error("Error occured while registering!!");
      }
    }
  } catch (error) {
    alert(error?.message);
  }
}

async function editUser(event) {
  try {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const dob = document.getElementById("dob").value;
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm").value;
    const mobile = document.getElementById("mobile").value;
    const email = document.getElementById("email").value;
    const genderArr = document.getElementsByName("gender");
    let gender;
    for (let inc = 0; inc < genderArr.length; inc++) {
      if (genderArr[inc].checked) {
        gender = genderArr[inc].value;
      }
    }

    if (
      !dob ||
      !password ||
      !confirm ||
      !gender ||
      !gender ||
      !mobile ||
      !email
    ) {
      alert("Enter all details before registering!!");
      return;
    } else {
      if (password !== confirm) {
        alert("Password and confirm password dont match!!");
        return;
      }

      const userID = localStorage.getItem("userID");
      const res = await fetch(`${URL}/update/${userID}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({
          name,
          password,
          dob,
          gender,
          mobile,
          email,
        }),
      });

      if (res.status === 204) {
        const userID = localStorage.getItem("userID");
        window.location.href = `${NAV_URL}/view/${userID}`;
      } else {
        throw Error("Error occured while registering!!");
      }
    }
  } catch (error) {
    alert(error?.message);
  }
}

async function logoutUser() {
  try {
    const res = await fetch(`${URL}/logout`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (res.status === 200) {
      localStorage.clear();
      window.location.href = `${NAV_URL}/login`;
    } else {
      throw Error("Error occured while registering!!");
    }
  } catch (error) {
    alert(error?.message);
  }
}

async function deleteUser() {
  try {
    const userID = localStorage.getItem("userID");
    const res = await fetch(`${URL}/delete/${userID}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "DELETE",
    });

    if (res.status === 204) {
      localStorage.clear();
      window.location.href = `${NAV_URL}/login`;
    }
  } catch (error) {
    alert(error?.message);
  }
}

// Navigation to other pages
function gotoEditUserPage() {
  const userID = localStorage.getItem("userID");
  window.location.href = `${NAV_URL}/edit/${userID}`;
}

function goToLoginPage() {
  window.location.href = `${NAV_URL}/login`;
}

// eslint-disable-next-line no-unused-vars
function selectOtherUser(otherUserID) {
  const userID = localStorage.getItem("userID");
  localStorage.setItem("otherUserID", otherUserID);
  window.location.href = `${NAV_URL}/message/${userID}/${otherUserID}`;
}
