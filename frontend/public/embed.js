(function () {
  function createWidget() {
    var container = document.createElement('div')
    container.style.position = 'fixed'
    container.style.right = '16px'
    container.style.bottom = '16px'
    container.style.width = '320px'
    container.style.maxWidth = 'calc(100vw - 32px)'
    container.style.zIndex = '2147483647'
    container.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'

    var card = document.createElement('div')
    card.style.background = 'white'
    card.style.border = '1px solid #e5e7eb'
    card.style.borderRadius = '12px'
    card.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)'
    card.style.padding = '12px'

    var title = document.createElement('div')
    title.textContent = 'Ask the agent'
    title.style.fontSize = '14px'
    title.style.fontWeight = '600'
    title.style.marginBottom = '8px'
    card.appendChild(title)

    var input = document.createElement('input')
    input.type = 'text'
    input.placeholder = 'Type your question'
    input.style.width = '100%'
    input.style.border = '1px solid #d1d5db'
    input.style.borderRadius = '8px'
    input.style.padding = '8px 10px'
    input.style.fontSize = '14px'
    input.style.outline = 'none'
    input.style.marginBottom = '8px'
    card.appendChild(input)

    var button = document.createElement('button')
    button.textContent = 'Ask'
    button.style.display = 'inline-block'
    button.style.background = '#111827'
    button.style.color = 'white'
    button.style.border = '1px solid #111827'
    button.style.borderRadius = '8px'
    button.style.padding = '8px 12px'
    button.style.fontSize = '14px'
    button.style.cursor = 'pointer'
    card.appendChild(button)

    var status = document.createElement('div')
    status.style.marginTop = '8px'
    status.style.fontSize = '12px'
    status.style.color = '#6b7280'
    card.appendChild(status)

    var answer = document.createElement('div')
    answer.style.whiteSpace = 'pre-wrap'
    answer.style.marginTop = '8px'
    answer.style.fontSize = '14px'
    answer.style.color = '#111827'
    answer.style.borderTop = '1px solid #f3f4f6'
    answer.style.paddingTop = '8px'
    card.appendChild(answer)

    container.appendChild(card)
    document.body.appendChild(container)

    var endpoint = (window.SemantiksEmbed && window.SemantiksEmbed.endpoint) || (location.origin + '/api/ask')

    function ask() {
      var q = (input.value || '').trim()
      if (!q) {
        status.textContent = 'Please enter a question'
        return
      }
      button.disabled = true
      button.textContent = 'Asking…'
      status.textContent = ''
      answer.textContent = ''
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }) // uses active prompt automatically
      }).then(function (res) { return res.json() }).then(function (data) {
        if (data && data.answer) {
          answer.textContent = data.answer + '\n\n— Used prompt: ' + (data.usedPromptTitle || data.usedPromptId || '')
        } else if (data && data.error) {
          status.textContent = 'Error: ' + data.error
        } else {
          status.textContent = 'No answer'
        }
      }).catch(function (err) {
        status.textContent = 'Network error'
      }).finally(function () {
        button.disabled = false
        button.textContent = 'Ask'
        input.value = ''
      })
    }

    button.addEventListener('click', ask)
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') ask() })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget)
  } else {
    createWidget()
  }
})()


