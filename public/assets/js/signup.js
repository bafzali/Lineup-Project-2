$(function(){
    $("#sign-up").on("click", function(event){
        event.preventDefault();

        var newSignup = {
            firstName: $("#validationCustom01").val().trim(),
            lastName: $("#validationCustom02").val().trim(),
            userName: $("#validationCustomUsername").val().trim(),
            email: $("#validationCustom03").val().trim(),
            phoneNumber: $("#validationCustom04").val().trim(),
        };

        console.log(newSignup);

        $.ajax("/api/people", {
            type: "POST",
            data: newSignup
        }).then(function(){
            console.log("Creatd New User");
            location.reload(); 
        });
    })
})