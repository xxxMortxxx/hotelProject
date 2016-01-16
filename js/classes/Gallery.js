
function Gallery(galleryContainer){
    this.$galleryContainer = $(galleryContainer);
    this.__imageClass="zoomedImage";
    this.__$currentImageNode;
    this.__$imageBackgroundNode;

}

Gallery.prototype.init = function(){

    var $leftArrowNode = $("<div class='leftArrow'></div>"),
        $rightArrowNode = $("<div class='rightArrow'></div>");

    this.__$imageBackgroundNode = $('<div>',
        {
            'class':'zoomedImageBackground',
        })
        .append($leftArrowNode)
        .append($rightArrowNode);

    this.$galleryContainer.on('click',function(e){
        this.removeLastImage();
        var nodeName = e.target.nodeName,
            $imageNode = $('<img>',
                {
                    "src": e.target.src,
                    "class":this.__imageClass
                }
            );

        if(nodeName==='IMG'){
            this.__$currentImageNode = $(e.target);

            this.__$imageBackgroundNode.find('.leftArrow')
                .on('click',function(e){
                    e.stopPropagation();
                    this.move(-1);
                }.bind(this));

            this.__$imageBackgroundNode.find('.rightArrow')
                .on('click',function(e){
                    e.stopPropagation();
                    this.move(1);
                }.bind(this));

            this.__$imageBackgroundNode
                .on('click',function(){
                    $(this).remove();
                })
                .append($imageNode).prependTo('body');

            if(navigator.userAgent.search(/MSIE 8/) !== -1){
                this.__setImageMargins($imageNode);
            }
        }
    }.bind(this));
};

Gallery.prototype.removeLastImage = function(){
    this.__$imageBackgroundNode.find('.zoomedImage').remove();
};


Gallery.prototype.move = function (move) {
    var elem,
        $currentImageParent = this.__$currentImageNode.parents('.imageContainer');

    if(move>0) {
        elem = $currentImageParent.next().find('img')[0];
    }else{
        elem = $currentImageParent.prev().find('img')[0];
    }

    if(elem!==undefined) {
        var newSrc = elem.src;
        this.__$imageBackgroundNode.find('.zoomedImage')[0].src = newSrc;
        this.__$currentImageNode = $(elem);
    }
};

Gallery.prototype.__setImageMargins = function($node){
    $node.css({
        'margin-left': -$node.width() / 2,
        'margin-top': -$node.height() / 2
    });
};
