import { ErrorBag } from '../utils'

export default {
  inject: ['form'],

  props: {
    value: { required: true },
    title: { type: String, default: null },
    subtitle: { type: String, default: null },
    name: { type: String, default: null },
    inputName: { type: String, default: null },
    errors: {
      validator (errors) {
        return !errors || errors instanceof ErrorBag
      },

      default: null
    },
    inputClass: String,
    placeholder: String,
    autofill: [String, Boolean],
    autocomplete: [String, Boolean],
    autofocus: [Boolean],
    min: {},
    max: {}
  },

  data: () => ({
    expression: null,
    required: null
  }),

  computed: {

    id () {
      return `text${this._uid}`
    },

    nameKey () {
      const inputName = this.inputName
      const expression = this.expression

      if (inputName) return inputName

      return expression
    },

    feedback () {
      const errors = this.errors
      const form = this.form
      const name = this.nameKey

      if (errors) {
        return errors.get(name)
      }

      if (form && form.errors) {
        return form.errors.get(name)
      }

      return null
    }
  },

  methods: {
    /**
     * Mirror attributes from root element.
     *
     * @return {void}
     */
    updateAttributes () {
      if (!this.$vnode || !this.$vnode.data || !this.$vnode.data.attrs) return

      this.required = this.$vnode.data.attrs.hasOwnProperty('required')
    }
  },

  mounted () {
    const model = this.$vnode.data.model

    if (model) {
      this.expression = model.expression.split('.').pop()
    }

    this.updateAttributes()

    if (this.autofocus !== false) {
      this.$nextTick(() => {
        const el = this.$el.querySelector('[autofocus]')
        if (el) el.focus()
      })
    }
  },

  beforeUpdate () {
    this.updateAttributes()
  }
}
