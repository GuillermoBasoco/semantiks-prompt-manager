(function () {
  'use strict'

  var DEFAULT_ENDPOINT = null

  function detectDefaultEndpoint() {
    try {
      var scripts = document.getElementsByTagName('script')
      for (var i = scripts.length - 1; i >= 0; i--) {
        var s = scripts[i]
        if (!s || !s.src) continue
        if (s.src.indexOf('/semantiks-ask.js') !== -1) {
          var u = new URL(s.src)
          return u.origin + '/api/ask'
        }
      }
    } catch (e) {}
    return (window.SemantiksEmbed && window.SemantiksEmbed.endpoint) || (location.origin + '/api/ask')
  }

  DEFAULT_ENDPOINT = detectDefaultEndpoint()

  function styleText() {
    return [
      ':host{all:initial;contain:content;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111827}',
      '.container{position:fixed;right:16px;bottom:16px;width:320px;max-width:calc(100vw - 32px);z-index:2147483647}',
      '.card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;box-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1);padding:12px}',
      '.title{font-size:14px;font-weight:600;margin:0 0 8px 0}',
      '.input{width:100%;border:1px solid #d1d5db;border-radius:8px;padding:8px 10px;font-size:14px;outline:none;margin:0 0 8px 0;box-sizing:border-box}',
      '.btn{display:inline-block;background:#111827;color:#fff;border:1px solid #111827;border-radius:8px;padding:8px 12px;font-size:14px;cursor:pointer}',
      '.btn[disabled]{opacity:.7;cursor:default}',
      '.status{margin-top:8px;font-size:12px;color:#6b7280}',
      '.answer{white-space:pre-wrap;margin-top:8px;font-size:14px;color:#111827;border-top:1px solid #f3f4f6;padding-top:8px}',
      ':host([inline]) .container{position:static;width:auto;max-width:100%}',
    ].join('')
  }

  function template(contentDoc) {
    var root = contentDoc.createElement('div')
    root.className = 'container'

    var card = contentDoc.createElement('div')
    card.className = 'card'
    root.appendChild(card)

    var title = contentDoc.createElement('div')
    title.className = 'title'
    title.textContent = 'Ask the agent'
    card.appendChild(title)

    var input = contentDoc.createElement('input')
    input.className = 'input'
    input.type = 'text'
    input.placeholder = 'Type your question'
    card.appendChild(input)

    var button = contentDoc.createElement('button')
    button.className = 'btn'
    button.textContent = 'Ask'
    card.appendChild(button)

    var status = contentDoc.createElement('div')
    status.className = 'status'
    card.appendChild(status)

    var answer = contentDoc.createElement('div')
    answer.className = 'answer'
    card.appendChild(answer)

    return { root: root, input: input, button: button, status: status, answer: answer }
  }

  function defineElement() {
    if (customElements.get('semantiks-ask')) return

    function SemantiksAsk() { return Reflect.construct(HTMLElement, [], SemantiksAsk) }
    SemantiksAsk.prototype = Object.create(HTMLElement.prototype)
    SemantiksAsk.prototype.constructor = SemantiksAsk

    SemantiksAsk.observedAttributes = ['endpoint', 'prompt-id']

    SemantiksAsk.prototype.connectedCallback = function () {
      if (this._mounted) return
      this._mounted = true

      var shadow = this.attachShadow({ mode: 'open' })

      var style = document.createElement('style')
      style.textContent = styleText()
      shadow.appendChild(style)

      var parts = template(document)
      shadow.appendChild(parts.root)

      this._input = parts.input
      this._button = parts.button
      this._status = parts.status
      this._answer = parts.answer

      var ep = this.getAttribute('endpoint') || DEFAULT_ENDPOINT
      this._endpoint = ep

      var self = this
      this._button.addEventListener('click', function () { self._ask() })
      this._input.addEventListener('keydown', function (e) { if (e.key === 'Enter') self._ask() })
    }

    SemantiksAsk.prototype.attributeChangedCallback = function (name, oldValue, newValue) {
      if (name === 'endpoint') {
        this._endpoint = newValue || DEFAULT_ENDPOINT
      }
    }

    SemantiksAsk.prototype._ask = function () {
      var q = (this._input && this._input.value) ? this._input.value.trim() : ''
      if (!q) {
        this._status.textContent = 'Please enter a question'
        return
      }
      var self = this
      this._button.disabled = true
      this._button.textContent = 'Asking…'
      this._status.textContent = ''
      this._answer.textContent = ''

      var payload = { question: q }
      var promptId = this.getAttribute('prompt-id')
      if (promptId) { payload.promptId = Number(promptId) }

      fetch(this._endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(function (res) { return res.json() })
      .then(function (data) {
        if (data && data.answer) {
          var footer = data.usedPromptTitle || data.usedPromptId || ''
          self._answer.textContent = data.answer + (footer ? '\n\n— Used prompt: ' + footer : '')
          self._input.value = ''
        } else if (data && data.error) {
          self._status.textContent = 'Error: ' + data.error
        } else {
          self._status.textContent = 'No answer'
        }
      })
      .catch(function () { self._status.textContent = 'Network error' })
      .finally(function () {
        self._button.disabled = false
        self._button.textContent = 'Ask'
      })
    }

    customElements.define('semantiks-ask', SemantiksAsk)
  }

  defineElement()
})()


