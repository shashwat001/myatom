/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS203: Remove `|| {}` from converted for-own loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const secretKeyView = require('./secret-key-view');

const crypto = (require('../node_modules/crypto-js'));

module.exports = {

	activate(state) {
		this.secretKeyView = new secretKeyView(state.secretKeyViewState);
		this.secretkeyPanel = atom.workspace.addModalPanel({
			item: this.secretKeyView.getElement(),
			visible: false
		});

		/* Frequency Analysis */
		atom.commands.add('atom-text-editor', {
			'encrypt-decrypt:frequency-analysis': () => this.frequencyanalysis()


		/* Tranform text */
		}
		);
		atom.commands.add('atom-text-editor', {
			'encrypt-decrypt:transform-charToCode': () => this.transformcharToCode()
		});
		atom.commands.add('atom-text-editor', {
			'encrypt-decrypt:transform-codeToChar': () => this.transformcodeToChar()
		});
		atom.commands.add('atom-text-editor', {
			'encrypt-decrypt:transform-toUpperCase': () => this.transformtoUpperCase()
		});
		atom.commands.add('atom-text-editor', {
			'encrypt-decrypt:transform-toLowerCase': () => this.transformtoLowerCase()

		/* Caesar */
		}
		);
		atom.commands.add('atom-text-editor', {
			'encrypt-decrypt:encrypt-caesar': () => this.encryptcaesar()
		});
		atom.commands.add('atom-text-editor', {
			'encrypt-decrypt:decrypt-caesar': () => this.decryptcaesar()

		/* Vigenere */
		}
		);
		atom.commands.add('atom-text-editor', {
			'encrypt-decrypt:encrypt-vigenere': () => this.encryptvigenere()
		});
		atom.commands.add('atom-text-editor', {
			'encrypt-decrypt:decrypt-vigenere': () => this.decryptvigenere()
		/* AES */
		}
		);
		atom.commands.add('atom-text-editor', {
			'encrypt-decrypt:encrypt-aes': () => this.encryptaes()
		});
		atom.commands.add('atom-text-editor', {
			'encrypt-decrypt:decrypt-aes': () => this.decryptaes()
		/* DES */
		}
		);
		atom.commands.add('atom-text-editor', {
			'encrypt-decrypt:encrypt-des': () => this.encryptdes()
		});
		atom.commands.add('atom-text-editor', {
			'encrypt-decrypt:decrypt-des': () => this.decryptdes()
		/* Set event on Form Submit */
		}
		);
		const form = this.secretKeyView.getForm();
		form.addEventListener("submit", e => this.submitKey());
		form.addEventListener('keyup', e => {
			var key = e.which || e.keyCode;
			console.log(key);
			if (key === 27) { // 27 is escape
				this.hidePanel();
				return this.pane.activate();
			}

		});

		/* HASH */
		atom.commands.add('atom-text-editor', {
			'encrypt-decrypt:encrypt-md5': () => this.encryptmd5()
		});
		atom.commands.add('atom-text-editor', {
			'encrypt-decrypt:encrypt-sha1': () => this.encryptsha1()
		});
		return atom.commands.add('atom-text-editor', {
			'encrypt-decrypt:encrypt-sha256': () => this.encryptsha256()
		});
	},


	getTextSelected() {
		this.editor = atom.workspace.getActiveTextEditor();
		this.selection = this.editor.getLastSelection();
		return this.selection.getText();
	},

	replaceText(newText, option) {
		return this.selection.insertText(newText, option);
	},

	frequencyanalysis() {
		const text = this.getTextSelected();
		const lengthText = text.length;
		if (lengthText > 0) {
			const listChar = {};
			for (let i = 0, end = lengthText - 1, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
				const char = text.charAt(i);
				let nb = 0;
				if (char in listChar) {
					nb = listChar[char];
				}
				listChar[char] = nb + 1;
			}

			console.log(`Length of the text: ${lengthText}`);
			return (() => {
				const result = [];
				for (let key of Object.keys(listChar || {})) {
					const value = listChar[key];
					result.push(console.log(key + ' : ' + ((value * 100) / lengthText) + '%'));
				}
				return result;
			})();
		}
	},

	transformcharToCode() {
		const text = this.getTextSelected();
		const lengthText = text.length;
		if (lengthText > 0) {
			let newStr = '';
			const charSplit = ' ';
			for (let i = 0, end = lengthText - 1, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
				newStr = newStr + text.charCodeAt(i) + charSplit;
			}
			return this.replaceText(newStr.substring(0, newStr.length - 1), {
				'select': true
			});
		}
	},

	transformcodeToChar() {
		const text = this.getTextSelected();
		const lengthText = text.length;
		if (lengthText > 0) {
			const charSplit = ' ';
			const listCode = text.split(charSplit);
			let newStr = '';
			for (let code of Array.from(listCode)) {
				newStr = newStr + String.fromCharCode(code);
			}
			return this.replaceText(newStr, {
				'select': true
			});
		}
	},

	transformtoUpperCase() {
		const text = this.getTextSelected();
		return this.replaceText(text.toUpperCase(), {
			'select': true
		});
	},

	transformtoLowerCase() {
		const text = this.getTextSelected();
		return this.replaceText(text.toLowerCase(), {
			'select': true
		});
	},

	encryptshift(length, toUp) {
		/* The method charCodeAt() will always send a integer equal or less than 65535 */
		const modulus = 65535;
		const text = this.getTextSelected();
		let encryptedText = '';
		for (let i = 0, end = text.length - 1, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
			if (toUp) {
				encryptedText += String.fromCharCode((text.charCodeAt(i) + length) % modulus);
			} else {
				let codeTemp = text.charCodeAt(i) - length;
				if (codeTemp < 0) {
					codeTemp = modulus + codeTemp;
				}
				encryptedText += String.fromCharCode(codeTemp);
			}
		}
		return this.replaceText(encryptedText, {
			'select': true
		});
	},

	encryptcaesar() {
		return this.encryptshift(3, true);
	},

	decryptcaesar() {
		return this.encryptshift(3, false);
	},

	submitKey() {
		if (!this.secretKeyView.validate()) {
			console.log('Password not same')
			return;
		}

		const algo = this.secretKeyView.getAlgo();
		switch (algo) {
			case "vigenere":
				this.vigenereFromInput();
				break;
			case "aes":
				this.aesFromInput();
				break;
			case "des":
				this.desFromInput();
				break;
		}
		this.hidePanel();
		return this.pane.activate();
	},

	hidePanel() {
		this.secretKeyView.reset();
		return this.secretkeyPanel.hide();
	},

	vigenereFromInput() {
		return this.vigenere(this.secretKeyView.getInput().value, this.secretKeyView.getEncrypt());
	},

	vigenere(key, encrypt) {
		if (key.length === 0) {
			console.error('No key given');
			return false;
		}
		console.log(`key : ${key} - encrypt :${encrypt}`);

		/* Definition of alphabet */
		const A = 'A'.charCodeAt(0);
		const Z = 'Z'.charCodeAt(0);
		key = key.toUpperCase();

		/* Check if key is in alphabet */
		for (let n = 0, end = key.length - 1, asc = 0 <= end; asc ? n <= end : n >= end; asc ? n++ : n--) {
			const charKeyCode = key.charCodeAt(n);
			if ((charKeyCode < A) || (charKeyCode > Z)) {
				console.error('The key is not in the alphabet');
				return false;
			}
		}

		/* Variables declarations */
		const keyLength = key.length;
		const modulus = (Z - A) + 1;
		const text = this.getTextSelected().toUpperCase();
		let encryptedText = '';
		let index = 0;

		/* Encryption/Decryption of each characters */
		for (let i = 0, end1 = text.length - 1, asc1 = 0 <= end1; asc1 ? i <= end1 : i >= end1; asc1 ? i++ : i--) {
			const char = text.charAt(i);
			let charCode = char.charCodeAt(0);

			/* Check if character is in alphabet */
			if ((charCode >= A) && (charCode <= Z)) {
				var newCharCode;
				const charKey = key.charCodeAt(index) - A;
				charCode = charCode - A;
				if (encrypt) {
					newCharCode = ((charCode + charKey) % modulus) + A;
				} else {
					let codeTemp = charCode - charKey;
					/* Usefull because of the bad modulus result if the first numnber is < 0 */
					if (codeTemp < 0) {
						codeTemp = modulus + codeTemp;
					}
					newCharCode = (codeTemp) + A;
				}

				encryptedText += String.fromCharCode(newCharCode);
				index = (index + 1) % keyLength;
			} else {
				encryptedText += char;
			}
		}
		return this.replaceText(encryptedText, {
			'select': true
		});
	},

	encryptvigenere() {
		this.pane = atom.workspace.getActivePane();
		this.secretKeyView.setEncrypt(true);
		this.secretKeyView.setAlgo('vigenere');
		return this.secretkeyPanel.show();
	},

	decryptvigenere() {
		this.pane = atom.workspace.getActivePane();
		this.secretKeyView.setEncrypt(false);
		this.secretKeyView.setAlgo('vigenere');
		return this.secretkeyPanel.show();
	},

	aesFromInput() {
		console.log(this.secretKeyView.getInput())
		return this.aes(this.secretKeyView.getInput().value, this.secretKeyView.getEncrypt());
	},

	aes(key, encrypt) {
		let encryptedText;
		const text = this.getTextSelected();
		if (encrypt) {
			console.log(text + " " + key);
			var encryptedObject = crypto.AES.encrypt(text, key);
			var buff = new Buffer(encryptedObject.toString(), "base64");
			encryptedText = buff.toString('base64');
		} else {

			var buf = Buffer.from(text, 'base64');
			salt = buf.toString("hex", 8, 16),
			enc = buf.toString("hex", 16, buf.length),
			derivedParams = crypto.kdf.OpenSSL.execute(
				key,
				256 / 32,
				128 / 32,
				crypto.enc.Hex.parse(salt)
			),
			cipherParams = crypto.lib.CipherParams.create({
				ciphertext: crypto.enc.Hex.parse(enc)
			}),
			decrypted = crypto.AES.decrypt(
				cipherParams,
				derivedParams.key,
				{
					iv: derivedParams.iv
				}
			);

			encryptedText = decrypted.toString(crypto.enc.Utf8);
		}
		return this.replaceText(encryptedText, {
			'select': true
		});
	},

	encryptaes() {
		console.log('doing encryptions')
		this.pane = atom.workspace.getActivePane();
		this.secretKeyView.setEncrypt(true);
		this.secretKeyView.setAlgo('aes');
		return this.secretkeyPanel.show();
	},

	decryptaes() {
		this.pane = atom.workspace.getActivePane();
		this.secretKeyView.setEncrypt(false);
		this.secretKeyView.setAlgo('aes');
		return this.secretkeyPanel.show();
	},

	desFromInput() {
		return this.des(this.secretKeyView.getInput().value, this.secretKeyView.getEncrypt());
	},

	des(key, encrypt) {
		let encryptedText;
		const text = this.getTextSelected();
		if (encrypt) {
			encryptedText = crypto.DES.encrypt(text, key);
		} else {
			encryptedText = crypto.DES.decrypt(text, key);
		}
		return this.replaceText(encryptedText, {
			'select': true
		});
	},

	encryptdes() {
		this.pane = atom.workspace.getActivePane();
		this.secretKeyView.setEncrypt(true);
		this.secretKeyView.setAlgo('des');
		return this.secretkeyPanel.show();
	},

	decryptdes() {
		this.pane = atom.workspace.getActivePane();
		this.secretKeyView.setEncrypt(false);
		this.secretKeyView.setAlgo('des');
		return this.secretkeyPanel.show();
	},

	encryptmd5() {
		const text = this.getTextSelected();
		const hash = crypto.MD5(text);
		return this.replaceText(hash, {
			'select': true
		});
	},

	encryptsha1() {
		const text = this.getTextSelected();
		const hash = crypto.SHA1(text);
		return this.replaceText(hash, {
			'select': true
		});
	},

	encryptsha256() {
		const text = this.getTextSelected();
		const hash = crypto.SHA256(text);
		return this.replaceText(hash, {
			'select': true
		});
	}
};
