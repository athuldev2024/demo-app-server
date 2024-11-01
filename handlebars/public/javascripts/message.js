const LOCALHOST_URL = "http://localhost:3000";
const MESSAGE_URL = "http://localhost:3000/message";

let socket;
let tempMessages = [];

document.addEventListener("DOMContentLoaded", () => {
  const userID = localStorage.getItem("userID");
  socket = io(LOCALHOST_URL, { transports: ["websocket"] });

  socket.on("connect", () => {
    socket.emit("registerUser", userID);
  });

  socket.on("receiveMessage", (messageObj) => {
    tempMessages.push({
      ...messageObj,
      bgColor: messageObj.sender === userID ? "aqua" : "lightgreen",
      alignSelf: messageObj.sender === userID ? "flex-end" : "flex-start",
    });
    renderMessages();
  });

  renderMessages();
});

const templateSource = `
  {{#each tempMessages}}
    <div class="message-div">
      <div class="message" style="background-color: {{bgColor}};align-self: {{alignSelf}};">
        <p>{{message}}</p>
        <i class="fa-solid fa-trash" onclick="deleteMessage('{{id}}')"></i>
      </div>
    </div>
  {{/each}}
`;
const template = Handlebars.compile(templateSource);

const renderMessages = () => {
  console.log("++++++ Render messages +++++");
  const html = template({ tempMessages });
  document.getElementById("message-container").innerHTML = html;
};

// eslint-disable-next-line no-unused-vars
async function sendMessage() {
  try {
    const userID = localStorage.getItem("userID");
    const otherUserID = localStorage.getItem("otherUserID");
    const message = document.getElementById("message-input").value;

    if (!message) {
      alert("Please enter valid message!!");
      return;
    }

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

      const resJson = await res.json();
      socket.emit("multicastMessage", {
        messageObj: {
          id: resJson.messageID,
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
      alert("Message deleted!!");
      location.reload();
    } else {
      throw Error("Error occured while registering!!");
    }
  } catch (error) {
    alert(error?.message);
  }
}

// eslint-disable-next-line no-unused-vars
function goBackToViewPageFromMessage() {
  const NAV_URL = `${LOCALHOST_URL}/hbs`;
  const userID = localStorage.getItem("userID");
  window.location.href = `${NAV_URL}/view/${userID}`;
}
