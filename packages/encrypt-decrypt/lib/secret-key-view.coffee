module.exports =
class SecretKeyView
  constructor: () ->
    @encrypt = true
    @algo = 'vigenere'

    # Create root element
    @element = document.createElement('div')
    @element.classList.add('default-package')

    # Create message element
    message = document.createElement('div')
    message.textContent = "Enter the Encryption/Decryption Key (It should only be character)"
    message.classList.add('message')
    @element.appendChild(message)

    @form = document.createElement('form')

    @input = document.createElement('input')
    @input.classList.add('native-key-bindings')
    @input.type = "text"
    @input.size='35'
    @input.placeholder = "Encryption/Decryption Key"
    @form.appendChild(@input)

    submit = document.createElement('input')
    submit.type = "submit"
    submit.value = "Go !"
    @form.appendChild(submit)

    @element.appendChild(@form);

  # Returns an object that can be retrieved when package is activated
  serialize: ->

  # Tear down any state and detach
  destroy: ->
    @element.remove()

  getElement: ->
    @element

  getInput: ->
    @input

  getForm: ->
    @form

  setEncrypt:(isEncrypt) ->
    @encrypt = isEncrypt

  getEncrypt: ->
    @encrypt

  setAlgo:(theAlgo) ->
    @algo = theAlgo

  getAlgo: ->
    @algo
