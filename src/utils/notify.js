function showNotice(message, type = "info") {
  const notice = document.createElement("div");
  notice.className = `app-toast app-toast-${type}`;
  notice.setAttribute("role", type === "error" ? "alert" : "status");
  notice.textContent = message;
  document.body.append(notice);
  setTimeout(() => notice.remove(), 4000);
}

const downloadStatusNotify = (message, type) => showNotice(message, type);
const requestNotifyStatus = (message, type) => showNotice(message, type);

export { downloadStatusNotify, requestNotifyStatus };
