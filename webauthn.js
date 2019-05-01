"use strict";

let users = localStorage["users"] ? JSON.parse(localStorage["users"]) : [];

$(document).ready(() => {
  $("#signup-prompt").hide();
  $("#login-prompt").show();
});

$("#signup").on("click", event => {
  $("#signup-prompt").show();
  $("#login-prompt").hide();
});

$("#login").on("click", event => {
  $("#signup-prompt").hide();
  $("#login-prompt").show();
  navigator.credentials.get({
    publicKey: {
      allowCredentials: [],
      challenge: Uint8Array.from("challenge"),
      timeout: 120000,
    },
  }).then(credential => {
    let username = users.find(user => user.publicKeyId === credential.id).username;
    $("#login-success").show(0).delay(10000).hide(0);
    $("#login-prompt").hide();
    $("#page-prompt").show();
    $(".username-container").text(username);
    console.log("Log-In success");
    console.log(credential);
  }).catch(error => {
    $("#login-error").show(0).delay(10000).hide(0);
    console.error("An error ocurred trying to log-in:");
    console.error(error.name);
    console.error(error.message);
    console.error(error);
  });
});

$("#signup-form").on("submit", event => {
  event.preventDefault();

  let username = $("#username").val();
  let name = $("#name").val();
  if (users.find(user => user.username === username)) {
    $("#username-taken").show(0).delay(10000).hide(0);
    return;
  }
  let userid = users.length;
  let publicKey = {
    authenticatorSelection: {
      requireResidentKey: true,
    },
    rp: {
      id: "localhost",
      name: "WebAuthn Demo",
    },
    challenge: Uint8Array.from("challenge"),
    pubKeyCredParams: [
      {type: "public-key", alg: -7},
      {type: "public-key", alg: -35},
      {type: "public-key", alg: -36},
      {type: "public-key", alg: -257},
      {type: "public-key", alg: -258},
      {type: "public-key", alg: -259},
      {type: "public-key", alg: -37},
      {type: "public-key", alg: -38},
      {type: "public-key", alg: -39},
    ],
    timeout: 120000,
    user: {
      name: username,
      displayName: name,
      id: Uint8Array.from([userid]),
    }
  };

  console.log("public key: ", publicKey);
  navigator.credentials.create({publicKey}).then(credential => {
    $("#username").val("");
    $("#name").val("");
    console.log("Storing credential was successful");
    console.log(credential);
    users.push({
      username,
      name,
      id: userid,
      publicKeyId: credential.id,
    });
    localStorage["users"] = JSON.stringify(users);
    $("#signup-success").show(0).delay(10000).hide(0);
    $("#login-prompt").show();
    $("#signup-prompt").hide();
  }).catch(error => {
    $("#signup-error").show(0).delay(10000).hide(0);
    console.error("Could not create credential:");
    console.error(error.name);
    console.error(error.message);
    console.error(error);
  });
});
