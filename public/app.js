$(document).ready(function(){
  
    $("#home").on("click", function(e){
        e.preventDefault();

    });

    $("#scrape").on("click", function(e){
        e.preventDefault();
        $.ajax({
            type: "GET",
            url: "/scrape",
            success: function(results) {
                // console.log("got the data: " + results)
                // for (let i = 0; i < results.length; i++) {
                //     $("#news-results").append('<div class="panel panel-default">' + '<div class="panel-heading">' + '<h3 class="panel-title">' + '<a href="'+ results[i].url +'">'+ results[i].title + '</a>' + '<button type="button" class="btn btn-default" id="save-this-article">' + '<a href="/save-this-article"> Save this article </a>' + '</button>' + '</h3>'+
                //    '</div>'+
                //    '<div class="panel-body">' + results[i].blurb +'</div>'+ '</div>');
                // }
                console.log(results);
            }
        });
    });

    $("#btnSave").on("click", function(e){
        e.preventDefault();
        console.log("clicked");
        if (this.value()==="Save"){
            var newVal = this.value() = 'Saved';
            this.text(newVal);
        } 
        else {

        }
    });

    

});