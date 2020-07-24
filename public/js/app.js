// function submitForm(event) {
//   console.log("iam");
//   //   $("button").on("click", function (event) {
//   event.preventDefault(); // Stop the form from causing a page refresh.
//   var data = {
//     donatedBy: $("#membId").val(),
//     amount: $("#amount").val(),
//     donationDate: $("#donation_date").val(),
//   };
//   console.log(data);
//     $.ajax({
//       url: "/donation",
//       data: data,
//       method: "POST",
//     })
//       .then(function (response) {
//         window.location.reload(true);
//         alert("You have successfully added the donation", response);
//       })
//       .catch(function (err) {
//         console.error(err);
//       });
//     });
// }
