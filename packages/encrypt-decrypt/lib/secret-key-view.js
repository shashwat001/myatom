/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let SecretKeyView;
module.exports =
(SecretKeyView = class SecretKeyView {
  constructor() {
    this.encrypt = true;
    this.algo = 'vigenere';

    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('default-package');

    // Create message element
    const message = document.createElement('div');
    message.textContent = "Enter the Encryption/Decryption Key (It should only be character)";
    message.classList.add('message');
    this.element.appendChild(message);

    this.form = document.createElement('form');

    this.input = document.createElement('input');
    this.input.classList.add('native-key-bindings');
    this.input.type = "password";
    this.input.size='35';
    this.input.placeholder = "Encryption/Decryption Key";
    this.form.appendChild(this.input);

    this.confirm = document.createElement('input');
    this.confirm.classList.add('native-key-bindings');
    this.confirm.type = "password";
    this.confirm.size='35';
    this.confirm.placeholder = "Confirm Encryption/Decryption Key";
    this.form.appendChild(this.confirm);

    const submit = document.createElement('input');
    submit.type = "submit";
    submit.value = "Go !";
    this.form.appendChild(submit);

    this.element.appendChild(this.form);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    return this.element.remove();
  }

  getElement() {
    return this.element;
  }

  getInput() {
    return this.input;
  }

  getForm() {
    return this.form;
  }

  setEncrypt(isEncrypt) {
    return this.encrypt = isEncrypt;
  }

  getEncrypt() {
    return this.encrypt;
  }

  setAlgo(theAlgo) {
    return this.algo = theAlgo;
  }

  getAlgo() {
    return this.algo;
  }

  reset() {
    this.input.value = "";
    this.confirm.value = "";
  }

  validate() {
    return this.input.value == this.confirm.value;
  }
});
