function TemplatesLoader(options){
    this.urls = options.urls;
    this.onAllLoaded = options.onAllLoaded;
    this.storage = options.storage;
    this.loaded = 0;
    this.total = this.urls.length;
}

TemplatesLoader.prototype.start = function(){
    this.urls.forEach(function(url){

        $.ajax({
            url:url,
            context:this
        }).done(function(data){
            var templateName = url.match(/\/(\w+)\.html$/i)[1];
            this.storage[templateName] = _.template(data);
            this.loaded++;
            console.log(this);
            if(this.loaded===this.total){
                this.onAllLoaded();
            }
        });

    }.bind(this));
};