$(function () {
  $("#add-new-group").on("click", function (event) {
    event.preventDefault();

    let newGroup = {
      name: $("#new-group-name").val().trim(),
      admin: "1",

    };

    let checked = $("input:checked")
    let peopleIds = [];
    for (let i = 0; i < checked.length; i++) {
      peopleIds.push($(checked[i]).attr("id"));
    }

    let body = { newGroup: newGroup, peopleIds: peopleIds };

    $.ajax("/api/groups", {
      type: "POST",
      data: body,
    }).then(function (data) {
      console.log("Created New Group");
      $("body").text(data);
    });
  });

  $("#delete-member").on("click", function (event) {
    event.preventDefault();

    var id = $(this).data("id")

    $.ajax("/api/groups", {
      type: "DELETE",
      data: id
    }).then(function () {
      console.log("Deleted Member");
      location.reload();
    });
  });
});

// $("#add-new-member").on("click", function(event){
//     event.preventDefault();
//     // console.log("Click");

//     var newMember = {
//         name: $("#add-username").val().trim(),
//         admin: "1"
//     }

//     console.log(newMember);

//     $.ajax("/api/groups", {
//         type: "POST",
//         data: newMember
//     }).then(function(){
//         console.log("created new member");
//         // location.reload();
//     })
// })
