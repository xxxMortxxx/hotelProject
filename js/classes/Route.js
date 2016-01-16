
function Route(options){
    this._routes = options.routes;
    this.onEveryHashCange = options.onEveryHashCange;
    this.init = function(){
        $(window).on('hashchange',this.__onHashCange.bind(this));
        $(window).on('load',this.checkHash.bind(this));
    }

}

Route.prototype.__onHashCange = function() {
    if (this.onEveryHashCange !== undefined) {
        this.onEveryHashCange();
    }
    this.checkHash();
};

Route.prototype.checkHash = function(){
    var url = location.hash.slice(1);
    if(this._routes[url]!==undefined){
        this._routes[url]();
    }else if(this._routes['home']!==undefined){
        this._routes['home']();
    }
};