const express = require("express");
const p = require("phin");

express()
  .get("/", (_, response) => {
    p({
      url: "https://api.github.com/users/boiyama/repos?sort=updated",
      headers: {
        "User-Agent": "Awesome-Octocat-App"
      }
    }).then(repos => {
      response.jsonp(JSON.parse(repos.body.toString()));
    });
  })
  .listen(8080, () => console.log("Running"));
