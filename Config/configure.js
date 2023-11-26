// Configures an Express app with the provided configurations.
// Each configuration function in the array is applied to the app instance.
const configureApp = (configs) => {
    return function(){
        configs.map(config => config(this));
    };
};

module.exports = configureApp;