const App = (() => {
    const _methods = {};
    const _autoMethodNames = new Set();

    return class {
        constructor(options) {
            this._setUsePrefix();
            this._setIdAttribute();
            this._setOptions(options);
        }

        _setOptions(options) {
            if (!options) return false;

            if (!options.hasOwnProperty('add')) return false;

            this._addMethods(options.add);

            this._setUsePrefix(options.usePrefix);
            this._setIdAttribute(options.findId);
            this._setAutoMethodNames(options.auto);

            this.readyAndRun(options.callback);
        }

        usePrefix(isUse) {
            this._setUsePrefix(isUse);

            return this;
        }

        _setUsePrefix(isUse = true) {
            this._usePrefix = isUse;
        }

        _getUsePrefix() {
            return !!this._usePrefix;
        }

        add(methods) {
            this._addMethods(methods);

            return this;
        }

        _addMethods(methods) {
            if (!(typeof methods === 'object' && !Array.isArray(methods))) {
                throw '메서드 등록 실패';
            }

            Object.assign(_methods, methods);
        }

        getMethodNames() {
            return Object.keys(_methods);
        }

        auto(...methodNames) {
            this._setAutoMethodNames(methodNames);

            return this;
        }

        _setAutoMethodNames(methodNames) {
            if (!Array.isArray(methodNames)) return false;

            if (methodNames.length === 1 && Array.isArray(methodNames[0])) {
                methodNames = methodNames[0];
            }

            methodNames.forEach(methodName => _autoMethodNames.add(methodName));
        }

        _isFunction(func) {
            return !!(typeof func === 'function');
        }

        _runAuto() {
            [..._autoMethodNames].forEach(methodName => {
                const method = _methods[methodName];

                if (method && this._isFunction(method)) {
                    method();
                }
            })
        }

        findId(type) {
            this._setIdAttribute(type);
        }

        _setIdAttribute(type = 'id') {
            if (type && !(['id', 'data'].includes(type))) type = 'id';

            this._idAttribute = type;
        }

        _getAppId() {
            let appId = '';

            if (this._idAttribute === 'data') {
                appId = document.body.getAttribute('data-app-id');
            } else {
                appId = document.body.id;
            }

            return appId;
        }

        _getMethods() {
            const appId = this._getAppId();

            if (!appId) return [];

            const splitAppNamesRegExp = /[-_]+/;
            const appNames = appId.split(splitAppNamesRegExp);

            if (this._getUsePrefix()) appNames.shift();

            if (!appNames.length) return [];

            const mainMethod = appNames.shift();
            const methods = {
                names: [mainMethod],
                name: ''
            };
            const firstLetterRegExp = /^\w/;
            const toUpperFirstLetter = firstLetter => firstLetter.replace(firstLetterRegExp, letter => letter.toUpperCase());

            if (appNames.length) {
                appNames.reduce((methods, name, index) => {
                    const beforeName = methods.names[index];
                    const currentName = toUpperFirstLetter(name.trim());
                    const mergeName = `${beforeName}${currentName}`;

                    methods.names.push(mergeName);
                    methods.name = mergeName;

                    return methods;
                }, methods);
            }

            return methods.names;
        }

        _runMethods() {
            const methods = this._getMethods();

            methods.forEach(methodName => {
                const method = _methods[methodName];

                if (methodName && method && this._isFunction(method)) {
                    method();
                }
            });
        }

        _setCompleted() {
            this._completed = true;
        }

        _isCompleted() {
            return !!this._completed;
        }

        run(callback) {
            this._setCompleted();
            this._runAuto();
            this._runMethods();

            if (callback && typeof callback === 'function') {
                callback();
            }
        }

        readyAndRun(callback) {
            if (this._isCompleted()) return false;

            this._setCompleted();
            document.addEventListener('DOMContentLoaded', () => this.run(callback), false);
        }
    }
})();

export default App;