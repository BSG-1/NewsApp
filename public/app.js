$(document).ready(function(){
    
    //Home button
    $("#home").on("click", function(e){
        e.preventDefault();
    });

    //Scrape button
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

    //Save button
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

    //Notes
    // $(document).on("click", "#modalbutton", function(e) {
    //     // Empty the notes from the note section
    //     e.preventDefault()
    //     $("#notes").empty();
    //     console.log("DONE!!!")
    //     // Save the id from the button tag
    //     var thisId = $(this).attr("data-id");
    //     $("#articleId").text(thisId);
    //     // Now make an ajax call for the Article
    //     $.ajax({
    //     method: "GET",
    //     url: "/articles/" + thisId
    //     })
    //     // With that done, add the note information to the page
    //     .done(function(data) {
    //         console.log(data);
    //         // Placeholder for notes
    //         $("#notes").append("<p id='actualnotes'></p>");
    //         if (data.notes) {
    //         $("#actualnotes").append("<ul id='notelist'>");
    //             for (var i = 0; i < data.notes.length; i++) {
    //             $('#notelist').append("<li id='" + data.notes[i]._id + "'>" + data.notes[i].body + " " +
    //             "<button data-id='" + data.notes[i]._id +
    //             "' id='deletenote'>X</button></li>");
    //             }
    //         $('#actualnotes').append("</ul>");
    //         } else {
    //         $('#actualnotes').text("There aren't any notes yet.");
    //         }
    //         // A textarea to add a new note body
    //         $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
    //         // A button to submit a new note, with the id of the article saved to it
    //         $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
    //     });
    // });
    // // When you click the savenote button
    // $(document).on("click", "#savenote", function() {
    //     // Grab the id associated with the article from the submit button
    //     var thisId = $(this).attr("data-id");
    //     // Run a POST request to change the note, using what's entered in the inputs
    //     $.ajax({
    //     method: "POST",
    //     url: "/articles/" + thisId,
    //     data: {
    //         // Value taken from note textarea
    //         body: $("#bodyinput").val()
    //     }
    //     })
    //     // With that done
    //     .done(function(data) {
    //         $("#notelist").empty();
    //         for (var i = 0; i < data.notes.length; i++) {
    //         $("#notelist").append("<li id='" + data.notes[i]._id + "'>" + data.notes[i].body + " " + "<button data-id='" + data.notes[i]._id +
    //         "' id='deletenote'>X</button></li>");
    //         }
    //     });
    //     // Also, remove the values entered in the input and textarea for note entry
    //     $("#bodyinput").val("");
    // });
    // // When you click the deletenote button
    // $(document).on("click", "#deletenote", function() {
    //     // Grab the id associated with the note
    //     var thisId = $(this).attr("data-id");
    //     // Run a POST request to delete the note
    //     $.ajax({
    //     method: "GET",
    //     url: "/notes/" + thisId,
    //     })
    //     // With that done
    //     .done(function(data) {
    //         $("#" + data._id).remove();
    //     });
    // });

});