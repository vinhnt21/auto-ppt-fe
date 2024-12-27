class Feedback {
  constructor() {
    this.form = document.getElementById("feedbackForm");
    this.textarea = document.getElementById("feedback");
    this.charCount = document.getElementById("charCount");
    this.loadingModal = new bootstrap.Modal(
      document.getElementById("loadingModal")
    );
    this.successModal = new bootstrap.Modal(
      document.getElementById("successModal")
    );

    this.init();
  }

  init() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    this.textarea.addEventListener("input", () => this.updateCharCount());
  }

  updateCharCount() {
    const count = this.textarea.value.length;
    this.charCount.textContent = count;
  }

  async handleSubmit(e) {
    e.preventDefault();

    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      feedback: this.textarea.value,
    };

    this.loadingModal.show();

    try {
      // Replace with your actual feedback endpoint
      await makeRequest("/submit-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      this.loadingModal.hide();
      this.successModal.show();
      this.form.reset();
      this.updateCharCount();
    } catch (error) {
      this.loadingModal.hide();
      showError("Không thể gửi góp ý: " + error.message);
    }
  }
}

new Feedback();
