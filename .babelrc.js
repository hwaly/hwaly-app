const isBabelRegister = caller => !!(caller && caller.name === "@babel/register");

module.exports = (api) => {
    const isRegister = api.caller(isBabelRegister);

    if (isRegister) {
        return {
            "presets": [
                [
                    "@babel/preset-env"
                ]
            ]
        }
    }

    return {
        "presets": [
            [
                "@babel/preset-env",
                {
                    "modules": false
                }
            ]
        ],
        "plugins": [
            [
                "@babel/plugin-transform-runtime",
                {
                    "corejs": 2,
                    "helpers": true,
                    "regenerator": true,
                    "useESModules": true
                }
            ]
        ]
    };
};