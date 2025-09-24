// Register service worker dan minta izin notifikasi
async function initPush() {
  if (!("serviceWorker" in navigator)) {
    console.log("Browser tidak support service workers");
    return;
  }

  // Daftarkan service worker
  const reg = await navigator.serviceWorker.register("/assets/web_push/service-worker.js");
  console.log("Service Worker registered", reg);

  // Minta izin user
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.log("Izin notifikasi ditolak");
    return;
  }

  // Subscribe ke Push Manager
  const subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: "<PUBLIC_VAPID_KEY_BASE64>"
  });

  // Kirim subscription ke server
  await frappe.call({
    method: "web_push.api.save_subscription",
    args: {
      endpoint: subscription.endpoint,
      auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey("auth")))),
      p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey("p256dh"))))
    }
  });

  console.log("Subscription terkirim ke server");
}

frappe.ready(() => {
  initPush();
});
