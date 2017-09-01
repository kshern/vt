
var prefix = 'sd'

var Directives = {
    text: function (el, value) {
        el.textContent = value;
    },
    show: function (el, value) {
        el.style.display = value ? '' : 'none'
    },
    on: {
        update: function (el, handler, event, value, directive) {
            if (!directive.handlers) {
                directive.handlers = {}
            }
            var handlers = directive.handlers
            if (handlers[event]) {
                el.removeEventListener(event, handlers[event])
            }
            if (handler) {
                handler = handler.bind(el)
                el.addEventListener(event, handler)
                handlers[event] = handler
            }
        }
    }
}

var Filter = {
    capitalize: function (value) {
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
    }
}

var selector = Object.keys(Directives).map(function (d) {
    return '[' + prefix + '-' + d + ']'
})

function Vue(opts) {
    var root = document.getElementById(opts.id)
    var els = root.querySelectorAll(selector)
    var bindings = {}
    var self = this
    self.scope = {}

        ;[].forEach.call(els, function (el) {
            cloneAttr(el.attributes).forEach(function (attr) {
                var directive = parseDirective(attr)
                if (directive) {
                    bindDirective(self, el, directive)
                }
            })
        })


    var scopeArr = Object.keys(bindings)

    for (var i = 0; i < scopeArr.length; i++) {
        self.scope[scopeArr[i]] = opts.scope[scopeArr[i]]
    }

    function bindDirective(vue, el, directive) {
        var key = directive.key
        var binding = bindings[key]
        if (!binding) {
            bindings[key] = binding = {
                value: undefined,
                directives: []
            }
        }
        directive.el = el;
        binding.directives.push(directive)
        if (!vue.scope.hasOwnProperty(key)) {
            bindAccessors(vue, key, binding)
        }


    }

    function bindAccessors(vue, key, binding) {
        Object.defineProperty(vue.scope, key, {
            get: function () {
                return binding.value
            },
            set: function (newValue) {
                binding.value = newValue;
                binding.directives.forEach(function (directive) {
                    if (newValue && directive.filters) {
                        newValue = applyFilters(newValue, directive)
                    }
                    directive.update(directive.el, newValue)
                })
            }
        })
    }

    function applyFilters(value, directive) {
        var value = value
        directive.filters.forEach(function (filter) {
            value = Filter[filter](value)
        })
        return value
    }


    function cloneAttr(attributes) {
        return [].map.call(attributes, function (attr) {
            return {
                name: attr.name,
                value: attr.value
            }
        })
    }
    function parseDirective(attr) {
        if (attr.name.indexOf(prefix) === -1) {
            return
        }
        var noprefix = attr.name.slice(prefix.length + 1)

        var eventIndex = noprefix.indexOf(':')
        dirname = eventIndex === -1?noprefix.slice(eventIndex):noprefix
        var def = Directives[dirname]

        var exp = attr.value

        var pipeIndex = exp.indexOf('|')

        var key = pipeIndex === -1 ? exp : exp.slice(0, pipeIndex)
        key = key.trim()

        var filters = pipeIndex === -1 ? null : exp.slice(pipeIndex + 1).split('|').map(function (filter) {
            return filter.trim()
        })

        return def ? {
            attr: attr,
            definition: def,
            filters: filters,
            key: key,
            update: typeof def === 'function' ? def : def.update
        } : null

    }
}