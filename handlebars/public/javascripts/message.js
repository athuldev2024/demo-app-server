const MESSAGE_URL = "http://localhost:3000/message";

let inc = 0,
  socket;

// document.getElementById("messages") &&
//   document.getElementById("messages-template") &&
//   renderMessages &&
//   renderMessages();

(function () {
  const userID = localStorage.getItem("userID");
  socket = io("http://localhost:3000", {
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    socket.emit("registerUser", userID);
    renderMessages && renderMessages();
  });

  socket.on("receiveMessage", (messageObj) => {
    allMessages.push({
      id: ++inc,
      ...messageObj,
      bgColor: messageObj.sender === userID ? "aqua" : "lightgreen",
    });
  });
})();

const renderMessages = () => {
  try {
    const templateSource =
      document.getElementById("messages-template").innerHTML;
    const template = Handlebars.compile(templateSource);
    const messagesContainer = document.getElementById("messages");
    console.log("allMessages ======> ", allMessages);
    messagesContainer.innerHTML = template({ allMessages });
  } catch (error) {
    console.log("Error: ", error);
  }
};

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
      document.getElementById("message-input").value = "";
      console.log("Message added!!");

      socket.emit("multicastMessage", {
        messageObj: {
          sender: userID,
          receiver: otherUserID,
          message,
        },
        userIds: [userID, otherUserID],
      });
    } else {
      throw Error("Error occured while registering!!");
    }
  } catch (error) {
    console.log("Error: ", error);
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
      const removeIndex = allMessages.findIndex(
        (item) => item.id === messageID
      );
      allMessages.splice(removeIndex, 1);

      alert("Message deleted!!");

      renderMessages();
    } else {
      throw Error("Error occured while registering!!");
    }
  } catch (error) {
    alert(error?.message);
  }
}

// eslint-disable-next-line no-unused-vars
function goBackToViewPageFromMessage() {
  const NAV_URL = "http://localhost:3000/hbs";
  const userID = localStorage.getItem("userID");
  window.location.href = `${NAV_URL}/view/${userID}`;
}
