const BASE_URL = "https://auto-ppt-be.onrender.com/api";
// Update current year in footer
document.getElementById("currentYear").textContent = new Date().getFullYear();

// Show error message
function showError(message) {
  const modalElement = document.createElement("div");
  modalElement.classList.add("modal", "fade");
  modalElement.innerHTML = `
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title text-danger">Lỗi</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body ">
                <p>${message}</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Đóng</button>
            </div>
        </div>
    </div>
  `;
  document.body.appendChild(modalElement);
  const modal = new bootstrap.Modal(modalElement);
  modal.show();
}

// API handling functions
async function makeRequest(url, options = {}) {
  url = `${BASE_URL}${url}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    showError("Đã có lỗi xảy ra: " + error.message);
    return Promise.reject(error);
  }
}
