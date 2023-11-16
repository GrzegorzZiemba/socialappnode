document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const messages = document.getElementById('messages');
    const username = document.getElementById('username').value;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (input.value) {
            socket.emit('chat message', { msg: input.value, user: username });
            input.value = '';
        }
    });

    socket.on('chat message', function(data) {
        const item = document.createElement('li');
        item.textContent = data.user + ": " + data.msg;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });
});
