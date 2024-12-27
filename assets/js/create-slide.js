class SlideCreator {
  constructor() {
    this.uploadForm = document.getElementById("uploadForm");
    this.slidesContainer = document.getElementById("slidesContainer");
    this.slideAccordion = document.getElementById("slideAccordion");
    this.createPPTBtn = document.getElementById("createPPTBtn");
    this.downloadSection = document.getElementById("downloadSection");
    this.loadingModal = null;
    this.init();
  }

  init() {
    this.uploadForm.addEventListener("submit", (e) => this.handleUpload(e));
    this.createPPTBtn.addEventListener("click", () => this.createPowerPoint());
  }

  async handleUpload(e) {
    e.preventDefault();
    const formData = new FormData();
    const file = document.getElementById("docxFile").files[0];

    if (!file) {
      showError("Vui lòng chọn file");
      return;
    }

    formData.append("file", file);

    this.showLoading();
    try {
      const response = await makeRequest("/upload-docx", {
        method: "POST",
        body: formData,
      });

      if (response && response.slides_content) {
        this.displaySlides(response.slides_content);
      } else {
        showError("Internal server error");
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.hideLoading();
    }
  }

  displaySlides(slides) {
    this.uploadForm.classList.add("d-none");
    this.slidesContainer.classList.remove("d-none");
    this.slideAccordion.innerHTML = "";

    slides.forEach((content, index) => {
      const slideHtml = `
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" 
                                data-bs-target="#slide${index}">
                            Slide ${index + 1}
                        </button>
                    </h2>
                    <div id="slide${index}" class="accordion-collapse collapse show">
                        <div class="accordion-body">
                            <textarea class="form-control slide-content">${content}</textarea>
                        </div>
                    </div>
                </div>
            `;
      this.slideAccordion.insertAdjacentHTML("beforeend", slideHtml);
    });
  }

  async createPowerPoint() {
    const slides = Array.from(document.querySelectorAll(".slide-content"))
      .map((textarea) => `${textarea.value.trim()}\n`)
      .filter((content) => content !== "");

    if (slides.length === 0) {
      showError("Vui lòng thêm nội dung cho ít nhất một slide");
      return;
    }

    const includeImages = document.getElementById("includeImages").checked;

    this.showLoading();

    try {
      const response = await makeRequest("/create-powerpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slides_content: slides,
          slide_with_img: includeImages,
        }),
      });
      console.log(response);

      this.handleDownload(response.link_to_download, response.slide_name);
    } finally {
      this.hideLoading();
    }
  }

  handleDownload(downloadLink, slide_name) {
    downloadLink = `${BASE_URL}${downloadLink}`;
    this.downloadSection.classList.remove("d-none");
    this.slidesContainer.classList.add("d-none");
    document.getElementById("downloadBtn").href = downloadLink;

    const slides = JSON.parse(localStorage.getItem("slides") || "[]");
    slides.push({
      link: downloadLink,
      date: new Date().toISOString(),
      name: slide_name,
    });
    localStorage.setItem("slides", JSON.stringify(slides));
  }

  showLoading() {
    const modalElement = document.getElementById("loadingModal");
    if (modalElement) {
      this.loadingModal = new bootstrap.Modal(modalElement, {
        backdrop: "static",
        keyboard: false,
      });
      this.loadingModal.show();
    }
  }

  hideLoading() {
    if (this.loadingModal) {
      this.loadingModal.hide();
      // Thêm event listener để xử lý sau khi modal đã ẩn hoàn toàn
      const modalElement = document.getElementById("loadingModal");
      modalElement.addEventListener("hidden.bs.modal", () => {
        this.loadingModal = null;
      });
    }
  }
}

new SlideCreator();
