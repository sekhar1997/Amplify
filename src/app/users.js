var User = function (data) {
  console.log(data);
  this.id = data["id"].value;
  this.name = data["Name"].value;
  this.email = data["Email"].value;
};
module.exports = User;
