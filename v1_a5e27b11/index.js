

var prefix = 'sd',
    Directives = {
        text: function (el, value) {
            el.textContent = value || ''
        }
    },
    selector = Object.keys(Directives).map(function (d) {
        return '[' + prefix + '-' + d + ']'
    })

function Seed(opts) {
    var self = this,
        root = this.el = document.getElementById(opts.id),
        els = root.querySelectorAll(selector)
    bindings = {}

    self.scope = {}



    var scopeArr = opts.scope && Object.keys(opts.scope)

    for (var i = 0; i < scopeArr.length; i++) {
        self.scope[scopeArr[i]] = opts.scope[scopeArr[i]]
    }

    ;[].forEach.call(els, processNode);

    function processNode(el) {
        cloneAttributes(el.attributes).forEach(function (attr) {
            //需要将提取出来的属性和Directives中的属性做对比  找出what todo
            var directives = parseDirectives(attr);

            if (directives) {
                bindDirective(el,bindings,directives)
            }
        })
    }


    function bindDirective(el,bindings,directives){
        var key = directives.key
        binding = bindings[key]
        if(!binding){
            bindings[key] = binding = {
                value:undefined,
                directives:[]
            }
        }

        directive.el = el

        binding.directives.push(directive)

        

    }


    //el的属性节点中提取出属性 以数组形式存储 方便后边操作
    function cloneAttributes(attributes) {
        return [].map.call(attributes, function (attr) {
            return {
                name: attr.name,
                value: attr.value
            }
        })
    }
    //对sd-text 进行解析 
    function parseDirectives(attr) {
        if (attr.name.indexOf(prefix) === -1) return;

        var noprefix = attr.name.slice(prefix.length + 1) //取到text

            , def = Directives[noprefix]

        var exp = attr.value,
            pipeIndex = exp.indexOf('|'),
            key = pipeIndex === -1 ? exp.trim() : exp.slice(0, pipeIndex).trim(),
            filters = pipeIndex === -1 ? null : exp.slice(pipeIndex + 1).split('|').map(function (filter) {
                return filter.trim()
            })

        return def ? {
            attr: attr,
            key: key,
            filters: filters,
            definition: def,
            update: typeof def === 'function' ? def : def.update
        } : null

    }

    // var bindingsArr = Object.keys(selector)

    // for(var i = 0; i<bindingsArr.length;i++){

    // }


    function bind(variable) {
        // ;[].forEach.call(self.scope,function(){

        // })
        Object.defineProperty(self.scope, variable, {
            set: function (newVal) {

            }
        })
    }



}

// Seed.create = function(opts){
//     return new Seed(opts)
// }