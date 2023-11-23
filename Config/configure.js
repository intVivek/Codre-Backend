const appConfig = (configs) => {
    return function(){
        configs.map(config=>config(this));
    }
}

module.exports = appConfig