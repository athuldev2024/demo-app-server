const MESSAGE_URL = "http://localhost:3000/message";

// eslint-disable-next-line no-unused-vars
function selectOtherUser(otherUserID) {
  const userID = localStorage.getItem("userID");
  localStorage.setItem("otherUserID", otherUserID);
  window.location.href = `${NAV_URL}/message/${userID}/${otherUserID}`;
}

// eslint-disable-next-line no-unused-vars
async function sendMessage() {
  try {
    const userID = localStorage.getItem("userID");
    const otherUserID = localStorage.getItem("otherUserID");
    const message = document.getElementById("message-input").value;

    const res = await fetch(`${MESSAGE_URL}/ping`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ sender: userID, receiver: otherUserID, message }),
    });

    if (res.status === 201) {
      console.log("Message added!!");
    } else {
      throw Error("Error occured while registering!!");
    }
  } catch (error) {
    alert(error?.message);
  }
}

// eslint-disable-next-line no-unused-vars
async function deleteMessage(messageID) {
  try {
    const res = await fetch(`${MESSAGE_URL}/delete/${messageID}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "DELETE",
      body: JSON.stringify({}),
    });

    if (res.status === 204) {
      alert("Message deleted!!");
    } else {
      throw Error("Error occured while registering!!");
    }
  } catch (error) {
    alert(error?.message);
  }
}
