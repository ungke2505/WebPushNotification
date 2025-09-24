import frappe

@frappe.whitelist(allow_guest=True)
def save_subscription(endpoint, auth, p256dh):
    """Simpan data subscription ke database"""
    user = frappe.session.user or "Guest"

    # cek kalau subscription sudah ada
    existing = frappe.db.exists("Web Push Subscription", {"endpoint": endpoint})
    if existing:
        return {"status": "exists", "name": existing}

    doc = frappe.get_doc({
        "doctype": "Web Push Subscription",
        "user": user,
        "endpoint": endpoint,
        "auth_key": auth,
        "p256dh_key": p256dh
    })
    doc.insert(ignore_permissions=True)
    return {"status": "ok", "name": doc.name}
