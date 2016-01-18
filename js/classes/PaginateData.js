
function PaginateData(options){
    this.$dataContainer = $(options.dataContainerSelector);
    this.dataTemplate=options.dataTemplate;
    this.$controlContainer=$(options.controlContainerSelector);
    this.controlTemplate=options.controlTemplate;
    this.filters = options.filters;
    this.__firstFilter = true;
    this.onRender = options.onRender;
    this.dataInRow = options.dataInRow;
    this.data=[];
    this.rawData=[];
    this.currentPage;
    this.__getDataError = false;
}




PaginateData.prototype.setData = function(data){
    this.rawData = data;
    this.data = data;
};

PaginateData.prototype.displayItems = function(from,to){
    if(from<=this.data.length) {
        //console.log(this.data)
        var paginatedData = this.data.slice(from, to);
        this.$dataContainer.html(this.dataTemplate({data: paginatedData}));
    }
};

PaginateData.prototype.move = function(pages){
    if(pages>=0){
        if((this.currentPage+pages)*this.dataInRow<this.data.length){
            this.currentPage+=pages;
        }
    }else{
        if(this.currentPage+pages>=0){
            this.currentPage+=pages;
            console.log('prev');
        }
    }

    var from = this.currentPage*this.dataInRow,
        to = from+this.dataInRow;

    this.displayItems(from,to);
};

PaginateData.prototype.toPage = function(pageNumber){
    if(pageNumber*this.dataInRow<this.data.length){
        var from = pageNumber*this.dataInRow,
            to = from+this.dataInRow;

        this.displayItems(from,to);
        this.currentPage=pageNumber;
    }
};

PaginateData.prototype.initControl = function(){

    var $container = this.$controlContainer;

    var $pageLinks = $container.find('[data-pageNumber]'),
        $prevButton = $container.find('[data-prev]'),
        $nextButton = $container.find('[data-next]');

    $pageLinks.each(function(key,pageLink){
        var $pageLink = $(pageLink),
            pageNumber = $pageLink.attr('data-pageNumber');

        $pageLink.on('click',function(){
            this.toPage(pageNumber);
            UsefulFunctions.scrollToTop(200);
        }.bind(this));
    }.bind(this));

    $prevButton.on('click',function(){
        this.move(-1);
        UsefulFunctions.scrollToTop(200);
    }.bind(this));

    $nextButton.on('click',function(){
        this.move(1);
        UsefulFunctions.scrollToTop(200);
    }.bind(this));

};

PaginateData.prototype.addControl = function(){
    var pages=[];
    for (var i=0;i<Math.ceil(this.data.length/this.dataInRow);i++){
        pages.push(i);
    }
    this.$controlContainer.html(this.controlTemplate({pages:pages}));
};

PaginateData.prototype.render = function(){
    this.currentPage = 0;
    if(!this.__getDataError) {
        var from = this.currentPage * this.dataInRow,
            to = from + this.dataInRow;
        this.displayItems(from, to);
        this.addControl();
        this.initControl();
        this.onRender();
        this.__firstFilter=true;
    }else{
        //this.displayItems(0,0);
        this.$dataContainer.html('Sever error');
    }
    UsefulFunctions.scrollToTop();
};

PaginateData.prototype.filter = function(filterFunction){
    if(filterFunction!==undefined){
        if(this.filters[filterFunction]!==undefined) {
            var additionArgs = Array.prototype.slice.call(arguments,1),
                args=[];
            if(this.__firstFilter) {
                args = args.concat([this.rawData]).concat(additionArgs);
                this.data = this.filters[filterFunction].apply(null,args);
                this.__firstFilter=false;
            }else{
                args = args.concat([this.data]).concat(additionArgs);
                this.data = this.filters[filterFunction].apply(null,args);
            }
        }else {
            throw new Error('filter doesn\'t exist');
        }
    }else{
        this.data = this.rawData;
    }
};
