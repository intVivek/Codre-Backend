const configureApp = (configs) => {
    return function(){
        configs.map(config=>config(this));
    }
}

module.exports = configureApp