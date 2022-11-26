
/*
* vue-quill-editor ssr.js
* Author: surmon@foxmail.com
* Github: https://github.com/surmon-china/vue-quill-editor
*/

// Require sources
import Quill from 'quill'
import objectAssign from 'object-assign'

const quillDirective = globalOptions => {

  // Get quill instace name in directive
  const getInstanceName = (el, binding, vnode) => {
    let instanceName = null
    if (binding.arg) {
      instanceName = binding.arg
    } else if (vnode.data.attrs && (vnode.data.attrs.instanceName || vnode.data.attrs['instance-name'])) {
      instanceName = (vnode.data.attrs.instanceName || vnode.data.attrs['instance-name'])
    } else if (el.id) {
      instanceName = el.id
    }
    return instanceName || 'quill'
  }

  return {
    inserted(el, binding, vnode) {
      const self = vnode.context
      const options = binding.value || {}
      const instanceName = getInstanceName(el, binding, vnode)
      let quill = self[instanceName]

      // Emit event in Vue directive
      const eventEmit = (vnode, name, data) => {
        const handlers = (vnode.data && vnode.data.on) || 
                         (vnode.componentOptions && vnode.componentOptions.listeners)
        if (handlers && handlers[name]) handlers[name].fns(data)
      }

      // Initialize quill options
      if (!quill) {

        // Options
        const quillOptions = objectAssign({}, {
          theme: 'snow',
          boundary: document.body, 
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'font': [] }],
              [{ 'align': [] }],
              ['clean'],
              ['link', 'image', 'video']
            ]
          },
          placeholder: 'Insert text here ...',
          readOnly: false
        }, globalOptions, options)

        // Instance
        quill = self[instanceName] = new Quill(el, quillOptions)

        // Data init
        const model = vnode.data.model
        const _value = vnode.data.attrs ? vnode.data.attrs.value : null
        const _content = vnode.data.attrs ? vnode.data.attrs.content : null
        const disabled = vnode.data.attrs ? vnode.data.attrs.disabled : null
        const content = model ? model.value : (_value || _content)

        // Set editor content
        if (content) {
          quill.pasteHTML(content)
        }

        // Disabled editor
        if (disabled) {
          quill.enable(false)
        }

        // Mark model as touched if editor lost focus
        quill.on('selection-change', range => {
          if (!range) {
            eventEmit(vnode, 'blur', quill)
          } else {
            eventEmit(vnode, 'focus', quill)
          }
        })

        // Update model if text changes
        quill.on('text-change', (delta, oldDelta, source) => {
          let html = el.children[0].innerHTML
          const text = quill.getText()
          if (html === '<p><br></p>') {
            html = ''
            quill.root.innerHTML = html
          }
          if (model) {
            model.callback(html)
          }
          eventEmit(vnode, 'input', html)
          eventEmit(vnode, 'change', { text, html, quill })
        })

        // Emit ready event
        eventEmit(vnode, 'ready', quill)
      }
    },
    
    // Parse text model change
    componentUpdated(el, binding, vnode) {
      const self = vnode.context
      const instanceName = getInstanceName(el, binding, vnode)
      const options = binding.value || {}
      const quill = self[instanceName]
      if (quill) {
        const model = vnode.data.model
        const _value = vnode.data.attrs ? vnode.data.attrs.value : null
        const _content = vnode.data.attrs ? vnode.data.attrs.content : null
        const disabled = vnode.data.attrs ? vnode.data.attrs.disabled : null
        const content = model ? model.value : (_value || _content)
        const newData = content
        const oldData = el.children[0].innerHTML
        quill.enable(!disabled)
        if (newData) {
          if (newData != oldData) {
            const range = quill.getSelection()
            quill.root.innerHTML = newData
            setTimeout(() => {
              quill.setSelection(range)
            })
          }
        } else {
          quill.setText('')
        }
      }
    },
    
    // Destroy this directive
    unbind(el, binding, vnode) {
      if (vnode.context[binding.arg]) {
        vnode.context[binding.arg] = null
        delete vnode.context[binding.arg]
      }
    }
  }
}

// quillEditor
const quillEditor = quillDirective({})

// Global quill default options
const install = function (Vue, globalOptions = {}) {

  // Mount quill directive for Vue global
  Vue.directive('quill', quillDirective(globalOptions))
}

const VueQuillEditor = { Quill, quillEditor, install }

export default VueQuillEditor
export { Quill, quillEditor, install }
