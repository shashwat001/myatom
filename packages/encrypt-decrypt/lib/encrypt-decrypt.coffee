secretKeyView = require './secret-key-view'

crypto = (require '../node_modules/cryptojs-atom/cryptojs').Crypto

module.exports =

  activate: (state) ->
    @secretKeyView = new secretKeyView(state.secretKeyViewState)
    @secretkeyPanel = atom.workspace.addModalPanel(item: @secretKeyView.getElement(), visible: false)

    ### Frequency Analysis ###
    atom.commands.add 'atom-text-editor', 'encrypt-decrypt:frequency-analysis': => @frequencyanalysis()


    ### Tranform text ###
    atom.commands.add 'atom-text-editor', 'encrypt-decrypt:transform-charToCode': => @transformcharToCode()
    atom.commands.add 'atom-text-editor', 'encrypt-decrypt:transform-codeToChar': => @transformcodeToChar()
    atom.commands.add 'atom-text-editor', 'encrypt-decrypt:transform-toUpperCase': => @transformtoUpperCase()
    atom.commands.add 'atom-text-editor', 'encrypt-decrypt:transform-toLowerCase': => @transformtoLowerCase()

    ### Caesar ###
    atom.commands.add 'atom-text-editor', 'encrypt-decrypt:encrypt-caesar': => @encryptcaesar()
    atom.commands.add 'atom-text-editor', 'encrypt-decrypt:decrypt-caesar': => @decryptcaesar()

    ### Vigenere ###
    atom.commands.add 'atom-text-editor', 'encrypt-decrypt:encrypt-vigenere': => @encryptvigenere()
    atom.commands.add 'atom-text-editor', 'encrypt-decrypt:decrypt-vigenere': => @decryptvigenere()
    ### AES ###
    atom.commands.add 'atom-text-editor', 'encrypt-decrypt:encrypt-aes': => @encryptaes()
    atom.commands.add 'atom-text-editor', 'encrypt-decrypt:decrypt-aes': => @decryptaes()
    ### DES ###
    atom.commands.add 'atom-text-editor', 'encrypt-decrypt:encrypt-des': => @encryptdes()
    atom.commands.add 'atom-text-editor', 'encrypt-decrypt:decrypt-des': => @decryptdes()
    ### Set event on Form Submit ###
    form = @secretKeyView.getForm()
    form.addEventListener "submit", (e) => @submitKey()

    ### HASH ###
    atom.commands.add 'atom-text-editor', 'encrypt-decrypt:encrypt-md5': => @encryptmd5()
    atom.commands.add 'atom-text-editor', 'encrypt-decrypt:encrypt-sha1': => @encryptsha1()
    atom.commands.add 'atom-text-editor', 'encrypt-decrypt:encrypt-sha256': => @encryptsha256()


  getTextSelected: ->
    @editor = atom.workspace.getActiveTextEditor()
    @selection = @editor.getLastSelection()
    return @selection.getText()

  replaceText:(newText, option) ->
    @selection.insertText(newText, option)

  frequencyanalysis: ->
    text = @getTextSelected()
    lengthText = text.length
    if(lengthText > 0)
        listChar = {}
        for i in [0..lengthText-1]
            char = text.charAt(i)
            nb = 0
            if(char of listChar)
                nb = listChar[char]
            listChar[char] = nb + 1

        console.log 'Length of the text: ' + lengthText
        for own key, value of listChar
            console.log key + ' : ' + ((value*100)/lengthText) + '%'

  transformcharToCode: ->
    text = @getTextSelected()
    lengthText = text.length
    if(lengthText > 0)
        newStr = ''
        charSplit = ' '
        for i in [0..lengthText-1]
            newStr = newStr + text.charCodeAt(i) + charSplit
        @replaceText(newStr.substring(0, newStr.length-1), {'select': true})

  transformcodeToChar: ->
    text = @getTextSelected()
    lengthText = text.length
    if(lengthText > 0)
        charSplit = ' '
        listCode = text.split charSplit
        newStr = ''
        for code in listCode
            newStr = newStr + String.fromCharCode(code)
        @replaceText(newStr , {'select': true})

  transformtoUpperCase: ->
    text = @getTextSelected()
    @replaceText(text.toUpperCase() , {'select': true})

  transformtoLowerCase: ->
    text = @getTextSelected()
    @replaceText(text.toLowerCase() , {'select': true})

  encryptshift:(length, toUp) ->
    ### The method charCodeAt() will always send a integer equal or less than 65535 ###
    modulus = 65535
    text = @getTextSelected()
    encryptedText = ''
    for i in [0..text.length-1]
        if(toUp)
            encryptedText += String.fromCharCode((text.charCodeAt(i)+length)%modulus)
        else
            codeTemp = text.charCodeAt(i)-length
            if(codeTemp < 0)
                codeTemp = modulus + codeTemp
            encryptedText += String.fromCharCode(codeTemp)
    @replaceText(encryptedText, {'select': true})

  encryptcaesar: ->
    @encryptshift(3, true)

  decryptcaesar: ->
    @encryptshift(3, false)

  submitKey: ->
    @secretkeyPanel.hide()
    algo = @secretKeyView.getAlgo()
    switch algo
      when "vigenere" then @vigenereFromInput()
      when "aes" then @aesFromInput()
      when "des" then @desFromInput()
    @pane.activate()

  vigenereFromInput: ->
    @vigenere(@secretKeyView.getInput().value, @secretKeyView.getEncrypt())

  vigenere:(key, encrypt) ->
    if(key.length == 0)
        console.error('No key given')
        return false
    console.log 'key : ' + key + ' - encrypt :'+ encrypt

    ### Definition of alphabet ###
    A = 'A'.charCodeAt(0)
    Z = 'Z'.charCodeAt(0)
    key = key.toUpperCase()

    ### Check if key is in alphabet ###
    for n in [0..key.length-1]
        charKeyCode = key.charCodeAt(n)
        if(charKeyCode < A or charKeyCode > Z)
            console.error('The key is not in the alphabet')
            return false;

    ### Variables declarations ###
    keyLength = key.length
    modulus = Z - A + 1
    text = @getTextSelected().toUpperCase()
    encryptedText = ''
    index = 0

    ### Encryption/Decryption of each characters ###
    for i in [0..text.length-1]
        char = text.charAt(i)
        charCode = char.charCodeAt(0)

        ### Check if character is in alphabet ###
        if(charCode >= A and charCode <= Z)
            charKey = key.charCodeAt(index) - A
            charCode = charCode - A
            if(encrypt)
                newCharCode = ((charCode + charKey)%modulus) + A
            else
                codeTemp = charCode - charKey
                ### Usefull because of the bad modulus result if the first numnber is < 0 ###
                if(codeTemp < 0)
                    codeTemp = modulus + codeTemp
                newCharCode = (codeTemp) + A

            encryptedText += String.fromCharCode(newCharCode)
            index = (index+1)%keyLength
        else
            encryptedText += char
    @replaceText(encryptedText, {'select': true})

  encryptvigenere: ->
    @pane = atom.workspace.getActivePane()
    @secretKeyView.setEncrypt(true)
    @secretKeyView.setAlgo('vigenere')
    @secretkeyPanel.show()

  decryptvigenere: ->
    @pane = atom.workspace.getActivePane()
    @secretKeyView.setEncrypt(false)
    @secretKeyView.setAlgo('vigenere')
    @secretkeyPanel.show()

  aesFromInput: ->
    @aes(@secretKeyView.getInput().value, @secretKeyView.getEncrypt())

  aes:(key, encrypt) ->
    text = @getTextSelected()
    if(encrypt)
      encryptedText = crypto.AES.encrypt(text, key)
    else
      encryptedText = crypto.AES.decrypt(text, key)
    @replaceText(encryptedText, {'select': true})

  encryptaes: ->
    @pane = atom.workspace.getActivePane()
    @secretKeyView.setEncrypt(true)
    @secretKeyView.setAlgo('aes')
    @secretkeyPanel.show()

  decryptaes: ->
    @pane = atom.workspace.getActivePane()
    @secretKeyView.setEncrypt(false)
    @secretKeyView.setAlgo('aes')
    @secretkeyPanel.show()

  desFromInput: ->
    @des(@secretKeyView.getInput().value, @secretKeyView.getEncrypt())

  des:(key, encrypt) ->
    text = @getTextSelected()
    if(encrypt)
      encryptedText = crypto.DES.encrypt(text, key)
    else
      encryptedText = crypto.DES.decrypt(text, key)
    @replaceText(encryptedText, {'select': true})

  encryptdes: ->
    @pane = atom.workspace.getActivePane()
    @secretKeyView.setEncrypt(true)
    @secretKeyView.setAlgo('des')
    @secretkeyPanel.show()

  decryptdes: ->
    @pane = atom.workspace.getActivePane()
    @secretKeyView.setEncrypt(false)
    @secretKeyView.setAlgo('des')
    @secretkeyPanel.show()

  encryptmd5: ->
    text = @getTextSelected()
    hash = crypto.MD5(text)
    @replaceText(hash, {'select': true})

  encryptsha1: ->
    text = @getTextSelected()
    hash = crypto.SHA1(text)
    @replaceText(hash, {'select': true})

  encryptsha256: ->
    text = @getTextSelected()
    hash = crypto.SHA256(text)
    @replaceText(hash, {'select': true})
