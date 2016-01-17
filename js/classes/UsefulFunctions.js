

function UsefulFunctions(){
}


UsefulFunctions.scrollToTop = function(delay){
    if(delay!==undefined) {
        $('body,html').animate({scrollTop: 0}, delay);
    }else{
        $('body,html').scrollTop(0);
    }
};

