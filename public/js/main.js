const chat__form = document.querySelector('.chat__form');
const chat__mainwall = document.querySelector('.chat__mainwall');
const chat__infoUsers = document.querySelector('.chat__info-users');
const chat__infoTitle = document.querySelector('.chat__info-title');
const roominfMbl__nameOfRoom = document.querySelector('.roominfMbl__nameOfRoom');
const chat__usersinfMblUl = document.querySelector('.chat__usersinfMbl-ul');
const chat__clearBtn = document.querySelector('.caht__clear-btn')

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io();

socket.emit('joinRoom', { username, room });

// GET ROOM AND USERS
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})

socket.on('message', message => {
    outputMessage(message);
    chat__mainwall.scrollTop = chat__mainwall.scrollHeight;
})

socket.on('cleared', () => {
    chat__mainwall.innerHTML = ''
})

chat__form.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    socket.emit('chatMessage', msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

const outputMessage = message => {
    chat__mainwall.innerHTML += `
        <div class="chat__message">
            <div class="chat__message-top">
                <p class="chat__message-name">${message.username}</p>
                <p class="chat__message-date">${message.time}</p>
            </div>
            <p class="chat__message-text">${message.text}</p>
        </div>
    `;
}

const outputRoomName = room => {
    chat__infoTitle.innerHTML = room;
    roominfMbl__nameOfRoom.innerHTML = room;
}

const outputUsers = users => {
    chat__infoUsers.innerHTML = `
        ${users.map(user => `<li class="chat__info-user">${user.username}</li>`).join('')}
    `;
    chat__usersinfMblUl.innerHTML = `
        ${users.map(user => `<li class="chat__usersinfMbl-li">${user.username}</li>`).join('')}
    `;

}



// SCRIPT FOR MOBILE INFORMATION BLOCK
let chat__roominfMbl = document.querySelector('.chat__roominfMbl'),
    chat__roomMbl = document.querySelector('.chat__roomMbl'),
    chat__usersinfMbl = document.querySelector('.chat__usersinfMbl'),
    chat__usersMbl = document.querySelector('.chat__usersMbl'),
    caht__header = document.querySelector('.caht__header'),
    chat__content = document.querySelector('.chat__content'),
    isClick = false;

chat__roomMbl.addEventListener('click', () => {
    if (!isClick) {
        chat__roominfMbl.style.zIndex = '1';
        setTimeout(() => {
            chat__roominfMbl.style.left = '0';
        }, 10)
        isClick = true;
    } else {
        chat__roominfMbl.style.left = '-75%';
        setTimeout(() => {
            chat__roominfMbl.style.zIndex = '0';
        }, 100)
        isClick = false;
    }
})
chat__usersMbl.addEventListener('click', () => {
    if (!isClick) {
        chat__usersinfMbl.style.zIndex = '1';
        setTimeout(() => {
            chat__usersinfMbl.style.left = '0';
        }, 10)
        isClick = true;
    } else {
        chat__usersinfMbl.style.left = '-75%';
        setTimeout(() => {
            chat__usersinfMbl.style.zIndex = '0';
        }, 100)
        isClick = false;
    }
})
caht__header.addEventListener('click', () => {
    chat__roominfMbl.style.left = '-75%';
    chat__usersinfMbl.style.left = '-75%';
    setTimeout(() => {
        chat__usersinfMbl.style.zIndex = '0';
        chat__roominfMbl.style.zIndex = '0';
    }, 100)
    isClick = false;
})
chat__content.addEventListener('click', () => {
    chat__roominfMbl.style.left = '-75%';
    chat__usersinfMbl.style.left = '-75%';
    setTimeout(() => {
        chat__usersinfMbl.style.zIndex = '0';
        chat__roominfMbl.style.zIndex = '0';
    }, 100)
    isClick = false;
})
chat__clearBtn.addEventListener('click', () => {
    socket.emit('clear')
})