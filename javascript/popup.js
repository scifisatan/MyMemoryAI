// Access credentials from the global window object
const credentials = window.myCredentials;
let email, password

if (credentials) {
    email = credentials.email;
    password = credentials.password;
} else {
    console.log('Credentials not found!');
}

appendMessage('Hi, I am MyMemory. I am here to recall your Memory.', 'bot');

$('#send-button').click(function () {
    sendQuery();
});

$('#chat-input').keypress(function (e) {
    if (e.which === 13) {
        sendQuery();
    }
});

function sendQuery() {
    const userMessage = $('#chat-input').val();

    if (userMessage.trim() !== '') {
        appendMessage(userMessage, 'user');
        $('#chat-input').val('');
        requestServerForAnswer(userMessage);
    }
}

function appendMessage(message, sender) {
    let messageClass = sender === 'user' ? 'chat-message user' : 'chat-message bot';
    let imageUrl = sender === 'bot' ? 'images/bot.png' : ''; // Add your bot image path here
    let imageTag = sender === 'bot' ? `<img src="${imageUrl}" alt="${sender} image">` : '';
    let messageContent = `
                <div class="${messageClass}">
                    ${imageTag}
                    <div class="message-content">
                        ${message}
                    </div>
                </div>
            `;
    $('#chat-box-body').append(messageContent);
    $('#chat-box-body').scrollTop($('#chat-box-body')[0].scrollHeight);
}

function requestServerForAnswer(userInput) {
    let url = "https://projects.sthaarun.com.np/query";
    let data = { query: userInput, email: email, password: password };

    // Show typing indicator
    let typingIndicator = `<div class="chat-message bot typing-indicator-container">
                <img src="images/bot.png" alt="bot image">
                <div class="typing-indicator"><span></span><span></span><span></span></div>
            </div>`;
    $('#chat-box-body').append(typingIndicator);
    $('#chat-box-body').scrollTop($('#chat-box-body')[0].scrollHeight);

    $.ajax({
        url: url,
        data: JSON.stringify(data),
        contentType: "application/json",
        method: 'POST'
    }).done(function (response) {
        // Remove typing indicator when response is received
        $('.typing-indicator-container').remove();
        addBotResponseToChatBox(response);
    }).fail(function (error) {
        // Remove typing indicator in case of failure
        $('.typing-indicator-container').remove();
        response = [{ text: "I am facing some issues, Please try again later!<br>Email: <a href='mailto:info@khwopa.edu.np'>info@khwopa.edu.np</a><br>Phone: (+977) 1-5122094, 5122098" }];
        addBotResponseToChatBox(response);
    });
}

function addBotResponseToChatBox(response) {
    appendMessage(response.answer.trim(), 'bot');
}