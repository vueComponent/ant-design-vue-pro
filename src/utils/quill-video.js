import { Quill } from 'vue-quill-editor'
const BlockEmbed = Quill.import('blots/block/embed')
const Link = Quill.import('formats/link')
const ATTRIBUTES = ['height','width']
class Video extends BlockEmbed {
	static create (value) {
		let node = super.create()
		node.setAttribute('controls','controls')
		node.setAttribute('playsinline', 'true')
		node.setAttribute('webkit-playsinline', 'true')
		node.setAttribute('type', 'video/*')
		node.setAttribute('src', this.sanitize(value))
		return node
	}
	static formats (domNode) {
		return ATTRIBUTES.reduce((formats, attribute) => {
			if(domNode.hasAttribute(attribute)) {
				formats[attribute] = domNode.getAttribute(attribute)
			}
			return formats
		}, {})
	}
	static sanitize (url) {
		return Link.sanitize(url)
	}
	static value (domNode) {
		return domNode.getAttribute('src')
	}
	format (name, value) {
		if(ATTRIBUTES.indexOf(name) > -1) {
			if(value) {
				this.domNode.setAttribute(name, value)
			} else {
				this.domNode.removeAttribute(name)
			}
		} else {
			super.format(name, value)
		}
	}
	html() {
		const { video } = this.value()
		return `<a href="${video}" rel="external nofollow">${video}</a>`
	}
}

Video.blotName = 'video'
Video.className = 'ql-video'
Video.tagName = 'video'
export default Video