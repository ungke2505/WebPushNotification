self.addEventListener("push", function (event) {
  const data = event.data.json();
  const title = data.title || "ERPNext Notification";
  const options = {
    body: data.body,
    icon: "/assets/frappe/images/favicon.png"
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
