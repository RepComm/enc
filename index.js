
const get = (id) => document.getElementById(id);
const on = (e, type, cb, options) => e.addEventListener(type, cb, options);

let keyBuffer;

let keyInput = get("key-input");

let randKeyButton = get("rand-key");
on(randKeyButton, "click", (evt) => {
  keyBuffer = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    keyBuffer[i] = parseInt(Math.random() * 255);
  }
  keyInput.value = bufferToHex(keyBuffer);
});

let fset = (buffer, name = "out.bin") => {
  let element = get("f-out");
  element.download = name;
  element.href = buffer;
  element.click();
  console.log(element);
}

function bufferToHex(buffer) {
  return Array
    .from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

let dropBox = get("drop-box");
on(dropBox, "drop", (evt) => {
  evt.preventDefault();

  keyBuffer = new Uint8Array(keyInput.value.length);
  for (let i = 0; i < keyBuffer.length; i++) {
    keyBuffer[i] = keyInput.value.charCodeAt(i);
  }

  if (evt.dataTransfer && evt.dataTransfer.files && evt.dataTransfer.files.length > 0) {
    evt.dataTransfer.files[0].arrayBuffer().then((ab)=>{
      let buf = encryptBuffer(new Uint8Array(ab), keyBuffer);
      let blob = new Blob([buf], {type: 'application/octet-stream'});
      let url = URL.createObjectURL(blob);
      fset(url, evt.dataTransfer.files[0].name);
    });
  }
});
on(dropBox, "dragover", (evt) => {
  evt.preventDefault();
});

/**Encrypt a buffer by xor-ing with another
 * @param {Uint8Array} buffer 
 * @param {Uint8Array} key 
 */
function encryptBuffer(buffer, key) {
  let j = 0;
  for (let i = 0; i < buffer.length; i++) {
    if (j > key.length) j = 0;
    buffer[i] = buffer[i] ^ key[j];
    j++;
  }
  return buffer;
}