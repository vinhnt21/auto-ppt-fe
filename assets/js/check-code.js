const includeImagesCheckbox = document.getElementById("includeImages");

includeImagesCheckbox.addEventListener("change", async () => {
  console.log("change");
  if (includeImagesCheckbox.checked) {
    includeImagesCheckbox.checked = false;
    const CODE = prompt("NHẬP MÃ CODE ĐỂ KÍCH HOẠT CHỨC NĂNG NÀY").trim();
    if (CODE === "") {
      alert("MÃ CODE KHÔNG ĐƯỢC ĐỂ TRỐNG");
      includeImagesCheckbox.checked = false;
    }
    //    FETCH API /check-code
    const response = await fetch(`${BASE_URL}/check-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: CODE }),
    });
    if (!response.ok) {
      alert(
        `MÃ CODE KHÔNG ĐÚNG\nLIÊN HỆ ADMIN ĐỂ ĐƯỢC NHẬN MÃ CODE\nEMAIL: chuvangiaphuoc142@gmail.com`
      );
    } else {
      includeImagesCheckbox.checked = true;
    }
  }
});
