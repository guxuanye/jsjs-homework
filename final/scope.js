class Scope {
    constructor(initial, parent = null, type = 'global') {
        this.isDefine = {}
        this.variables = {}
        for (let key in initial) {
            this.variables[key] = initial[key]
            this.isDefine[key] = 'context'
        }
        this.type = type   // function | block
        this.parent = parent
    }
    declare(kind, name) {   // var | const | let
        if (this.isDefine[name] === 'context' && this.type === 'global') return false
        if (kind === 'const') kind = '-const'
        switch (this.type) {
            case 'global':
                this.isDefine[name] = kind
                break;
            case 'function':
                this.isDefine[name] = kind
                break;
            case 'block':
                if (kind === 'var') { // 在块级作用域中var，得交给上一级作用域
                    this.parent.declare(kind, name)
                } else {
                    this.isDefine[name] = kind
                }
                break;
        }
        return true
    }
    find(name) {
        if (this.isDefine[name]) {
            return this.isDefine[name]
        } else {
            if (this.parent === null) {
                if (name === 'this') return {}
                return 'notDefined'
            } else {
                return this.parent.find(name)
            }
        }
    }
    get(name) {
        if (this.isDefine[name]) {
            return this.variables[name]
        } else {
            if (this.parent === null) {
                if (name === 'this') return {}
                return undefined
                // throw new Error('error:not declare: ' + name)
            } else {
                return this.parent.get(name)
            }
        }
    }
    set(name, value) {
        if (this.isDefine[name]) {
            if (this.isDefine[name] === '-const') {
                this.isDefine[name] = 'const'
                this.variables[name] = value
            } else 
                if (this.isDefine[name] === 'context') {
                    return
                    // throw new TypeError('context can not be rewrite')
                } else
                if (this.isDefine[name] === 'const') {
                    throw new TypeError('Assignment to constant variable')
                    // return new TypeError('Assignment to constant variable')
                } else {
                    this.variables[name] = value
                }
        } else {
            if (this.parent === null) {
                return {
                    type: 'notDefine'
                }
                throw new Error('error:not declare ' + name)
            } else {
                this.parent.set(name, value)
            }
        }
    }
}

module.exports = Scope