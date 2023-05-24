const frisby = require("frisby");

it("should be user 1", function () {
  return frisby
    .post("localhost:8080/student/login", {
      data: {
        username: "owis",
        password: "owis1",
      },
    })
    .then(function (res) {
      expect(res.json.token).toBe(1);
    });
});
