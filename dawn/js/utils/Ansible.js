import AppDispatcher from '../dispatcher/AppDispatcher';

let runtimeAddress = localStorage.getItem('runtimeAddress') || '127.0.0.1';
let socket = io('http://' + runtimeAddress + ':5000/');
socket.on('connect', ()=>{
  console.log('Connected to runtime.')
  console.log(socket.io.engine.transport.name)
  });
socket.on('connect_error', (err)=>console.log(err));

/*
 * Hack for Ansible messages to enter Flux flow.
 * Received messages are dispatched as actions,
 * with action's type deteremined by msg_type
 */
socket.on('message', (message)=>{
  console.log(socket.io.engine.transport.name)
  let unpackedMsg = message.content;
  unpackedMsg.type = message.header.msg_type;
  AppDispatcher.dispatch(unpackedMsg);
});

/*
 * Module for communicating with the runtime.
 */
let Ansible = {
  /* Private, use sendMessage */
  _send(obj) {
    return socket.emit('message', JSON.stringify(obj));
  },
  /* Send data over ZMQ to the runtime */
  sendMessage(msgType, content) {
    let msg = {
      header: {
        msg_type: msgType
      },
      content: content
    };
    this._send(msg);
  }
};

export default Ansible;
