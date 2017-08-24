

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

    function bind(variable){
        ;[].forEach.call(self.scope,function(){

        })
    }



}

// Seed.create = function(opts){
//     return new Seed(opts)
// }