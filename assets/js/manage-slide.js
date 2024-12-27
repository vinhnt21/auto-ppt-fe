class SlideManager {
  constructor() {
    this.slidesTableBody = document.getElementById("slidesTableBody");
    this.noSlidesMessage = document.getElementById("noSlidesMessage");
    this.copyAllBtn = document.getElementById("copyAllBtn");
    this.deleteModal = new bootstrap.Modal(
      document.getElementById("deleteModal")
    );
    this.copySuccessModal = new bootstrap.Modal(
      document.getElementById("copySuccessModal")
    );

    this.init();
  }

  init() {
    this.loadSlides();
    this.copyAllBtn.addEventListener("click", () => this.copyAllLinks());
  }

  loadSlides() {
    const slides = JSON.parse(localStorage.getItem("slides") || "[]");

    if (slides.length === 0) {
      this.noSlidesMessage.classList.remove("d-none");
      this.copyAllBtn.classList.add("d-none");
      return;
    }

    slides.forEach((slide) => this.addSlideRow(slide));
  }

  addSlideRow(slide) {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${slide.name.slice(0, 50)}...</td>
            <td>${new Date(slide.date).toLocaleDateString()}</td>
            <td>
                <div class="btn-group">
                    <a href="${
                      slide.link
                    }" class="btn btn-sm btn-primary hvr-curl-top-right">
                        <i class="fas fa-download"></i>
                    </a>
                    <button class="btn btn-sm btn-secondary copy-link hvr-curl-top-right">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-slide hvr-curl-top-right">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;

    this.slidesTableBody.appendChild(row);

    // Attach event handlers
    row
      .querySelector(".copy-link")
      .addEventListener("click", () => this.copyLink(slide.link));
    row
      .querySelector(".delete-slide")
      .addEventListener("click", () => this.confirmDelete(row, slide));
  }

  async copyLink(link) {
    try {
      await navigator.clipboard.writeText(link);
      this.copySuccessModal.show();
      setTimeout(() => this.copySuccessModal.hide(), 1500);
    } catch (err) {
      showError("Không thể copy link: " + err.message);
    }
  }

  async copyAllLinks() {
    const slides = JSON.parse(localStorage.getItem("slides") || "[]");
    const links = slides.map((slide) => slide.link).join("\n");

    try {
      await navigator.clipboard.writeText(links);
      this.copySuccessModal.show();
      setTimeout(() => this.copySuccessModal.hide(), 1500);
    } catch (err) {
      showError("Không thể copy links: " + err.message);
    }
  }

  confirmDelete(row, slide) {
    const confirmBtn = document.getElementById("confirmDeleteBtn");
    confirmBtn.onclick = () => this.deleteSlide(row, slide);
    this.deleteModal.show();
  }

  deleteSlide(row, slide) {
    const slides = JSON.parse(localStorage.getItem("slides") || "[]");
    const updatedSlides = slides.filter((s) => s.link !== slide.link);
    localStorage.setItem("slides", JSON.stringify(updatedSlides));

    row.remove();
    this.deleteModal.hide();

    if (updatedSlides.length === 0) {
      this.noSlidesMessage.classList.remove("d-none");
      this.copyAllBtn.classList.add("d-none");
    }
  }
}

new SlideManager();
