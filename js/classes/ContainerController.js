
function ContainerController(options){
    this.$container = $(options.container);
    this.onContentChange = options.onContentChange;
}

ContainerController.prototype.setContent = function (content) {
    this.$container.html(content);
    this.onContentChange();
};
