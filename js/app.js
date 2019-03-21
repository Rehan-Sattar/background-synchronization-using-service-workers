// check if user is online or not.

const cehckOnlineStatus = () => {
  const onlinestatusShower = document.getElementById("online-status-shower");

  if (navigator.onLine) {
    onlinestatusShower.innerHTML = "You are currently online!";
  } else {
    onlinestatusShower.innerHTML = "You are currently ofline!";
  }
};

//   status checking
window.addEventListener("online", cehckOnlineStatus);
window.addEventListener("offline", cehckOnlineStatus);

cehckOnlineStatus();
