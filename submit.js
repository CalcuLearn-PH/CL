const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (
      !entry.isIntersecting &&
      !entry.target.classList.contains("standby") &&
      entry.target.classList.contains("hidden-article")
    ) {
      console.log(entry.target);
      entry.target.classList.add("standby");
      entry.target.classList.remove("view");
    } else if (
      entry.isIntersecting &&
      !entry.target.classList.contains("view") &&
      !entry.target.classList.contains("standby") &&
      entry.target.classList.contains("hidden-article")
    ) {
      console.log(entry.target);
      entry.target.classList.add("standby");
      setTimeout(() => {
        entry.target.classList.remove("standby");
        entry.target.classList.add("view");
      }, 250);
    } else if (
      !entry.isIntersecting &&
      entry.target.classList.contains("view") &&
      entry.target.classList.contains("hidden-article")
    ) {
      console.log(entry.target);
      entry.target.classList.remove("view");
      entry.target.classList.add("standby");
    } else if (
      entry.isIntersecting &&
      entry.target.classList.contains("standby") &&
      entry.target.classList.contains("hidden-article")
    ) {
      console.log(entry.target);
      entry.target.classList.remove("standby");
      entry.target.classList.add("view");
    } else {
      //do nothing
    }
    if (
      !entry.isIntersecting &&
      !entry.target.classList.contains("standby") &&
      entry.target.classList.contains("hidden-list")
    ) {
      console.log(entry.target);
      entry.target.classList.add("standby");
      entry.target.classList.remove("view");
    } else if (
      entry.isIntersecting &&
      !entry.target.classList.contains("view") &&
      !entry.target.classList.contains("standby") &&
      entry.target.classList.contains("hidden-list")
    ) {
      console.log(entry.target);
      entry.target.classList.add("standby");
      setTimeout(() => {
        entry.target.classList.remove("standby");
        entry.target.classList.add("view");
      }, 250);
    } else if (
      !entry.isIntersecting &&
      entry.target.classList.contains("view") &&
      entry.target.classList.contains("hidden-list")
    ) {
      console.log(entry.target);
      entry.target.classList.remove("view");
      entry.target.classList.add("standby");
    } else if (
      entry.isIntersecting &&
      entry.target.classList.contains("standby") &&
      entry.target.classList.contains("hidden-list")
    ) {
      console.log(entry.target);
      entry.target.classList.remove("standby");
      entry.target.classList.add("view");
    } else {
      //do nothing
    }
  });
}, {});
const hiddenarticleElements = document.querySelectorAll(".hidden-article");
hiddenarticleElements.forEach((el) => observer.observe(el));

const hiddenlisteElements = document.querySelectorAll(".hidden-list");
hiddenlisteElements.forEach((el) => observer.observe(el));

const form = document.getElementById("form");
const submitButton = document.getElementById("submit-button");
const fileInput = document.getElementById("fileInput");
const fileNameDisplay = document.getElementById("fileNameDisplay");

fileInput.addEventListener("change", function () {
  if (this.files && this.files.length > 0) {
    fileNameDisplay.textContent = this.files[0].name;
  } else {
    fileNameDisplay.textContent = "No file selected";
  }
});

async function uploadFile(file) {
  // --------- SIM manual-download persistence helpers ----------
  function saveSimLink(simPath, simName) {
    try {
      localStorage.setItem("simDownloadPath", simPath);
      localStorage.setItem("simDownloadName", simName);
      localStorage.setItem("simDownloadClicks", "0"); // reset counter
      updateManualLink(simPath, simName);
    } catch (e) {
      console.warn("Could not save SIM link:", e);
    }
  }

  function loadSimLink() {
    const simPath = localStorage.getItem("simDownloadPath");
    const simName = localStorage.getItem("simDownloadName");
    if (simPath && simName) {
      updateManualLink(simPath, simName);
    } else {
      updateManualLinkToDefault();
    }
  }

  function clearSimLink() {
    localStorage.removeItem("simDownloadPath");
    localStorage.removeItem("simDownloadName");
    localStorage.removeItem("simDownloadClicks");
    updateManualLinkToDefault();
  }

  function incrementSimClick() {
    const current =
      parseInt(localStorage.getItem("simDownloadClicks") || "0", 10) + 1;
    localStorage.setItem("simDownloadClicks", String(current));
    return current;
  }

  function updateManualLink(simPath, simName) {
    const linkEl = document.getElementById("downloadAnswerKeyLink");
    const nameDisplay = document.getElementById("simFileNameDisplay");
    if (linkEl) {
      linkEl.href = encodeURI(simPath);
      linkEl.setAttribute("download", simName);
      linkEl.textContent = `Download Answer Key (${simName})`;
    }
    if (nameDisplay) nameDisplay.textContent = simName;
  }

  function updateManualLinkToDefault() {
    const linkEl = document.getElementById("downloadAnswerKeyLink");
    const nameDisplay = document.getElementById("simFileNameDisplay");
    if (linkEl) {
      linkEl.href = "#";
      linkEl.removeAttribute("download");
      linkEl.textContent = "Download Answer Key";
    }
    if (nameDisplay) nameDisplay.textContent = "";
  }

  // Manual download handler (connected from HTML onclick)
  async function downloadAnswerKey(e) {
    if (e && e.preventDefault) e.preventDefault();

    // Prefer explicit input; fallback to saved link
    const simInput = document.querySelector('input[name="SIM No."]');
    const simVal = simInput ? simInput.value.trim() : "";
    const simNum = parseInt(simVal, 10);

    let simPath = localStorage.getItem("simDownloadPath");
    let simName = localStorage.getItem("simDownloadName");

    if (!(!isNaN(simNum) && simNum >= 1 && simNum <= 10)) {
      // if invalid input, try to use saved link
      if (!simPath || !simName) {
        alert(
          "Please enter a SIM No. (1 - 10) to download its answer key or use the saved manual link.",
        );
        return;
      }
    } else {
      // build path from input (ensures user can download the one they entered)
      const romans = [
        "I",
        "II",
        "III",
        "IV",
        "V",
        "VI",
        "VII",
        "VIII",
        "IX",
        "X",
      ];
      const roman = romans[simNum - 1];
      simName = `SIM ${roman} - (Answer Key Included).pdf`;
      simPath = `./Answer Key/${simName}`;
    }

    // increment click count and check limit
    const clicks = incrementSimClick();
    if (clicks >= 5) {
      // clear link and notify user
      clearSimLink();
      alert("Manual download link has been deactivated after 5 clicks.");
      return;
    }

    // Try to fetch then download; fallback to direct link
    try {
      const res = await fetch(encodeURI(simPath));
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = simName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 5000);

        // persist the link (direct path fallback will also work after reload)
        saveSimLink(simPath, simName);
        return;
      } else {
        // not found: prepare manual link (direct path) and let browser handle clicking
        updateManualLink(simPath, simName);
        alert(
          "Automatic fetch failed; a manual download link has been prepared below.",
        );
      }
    } catch (err) {
      console.warn("Error during downloadAttempt:", err);
      updateManualLink(simPath, simName);
      alert(
        "Automatic download failed. A manual download link has been prepared below.",
      );
    }
  }
  // ---------- end helpers ----------
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = (e) => {
      const data = e.target.result.split(",");
      const obj = {
        fileName: file.name,
        mimeType: data[0].match(/:(\w.+);/)[1],
        data: data[1],
      };
      resolve(obj);
    };
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Validate required fields
  const studentName = document
    .querySelector('input[name="Student Name"]')
    .value.trim();
  const section = document.querySelector('input[name="Section"]').value.trim();
  const simNo = document.querySelector('input[name="SIM No."]').value.trim();
  const dos = document.querySelector('input[name="DOS"]').value.trim();
  const ageInput = document.querySelector('input[name="Age"]');
  const age = ageInput ? ageInput.value.trim() : "";
  const genderEl = document.querySelector('input[name="Gender"]:checked');
  const gender = genderEl ? genderEl.value : "";

  if (
    !studentName ||
    !gender ||
    !age ||
    !section ||
    !simNo ||
    !dos ||
    fileInput.files.length === 0
  ) {
    alert(
      "Please fill out all required fields:\n- Name\n- Gender\n- Age\n- Section\n- SIM No.\n- Date of Submission\n- Answer Sheet File",
    );
    return;
  }

  submitButton.textContent = "Submitting...";
  submitButton.style.display = "block";
  submitButton.style.backgroundColor = "beige";
  submitButton.style.borderColor = "rgb(193, 193, 154)";
  submitButton.style.color = "black";
  submitButton.disabled = true;
  submitButton.classList.add("is-loading");

  try {
    const formData = new FormData(this);
    const formDataObj = {};

    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
      formDataObj[key] = value;
    }

    // Handle file upload if a file is selected
    if (fileInput.files.length > 0) {
      const fileObj = await uploadFile(fileInput.files[0]);
      formDataObj.fileData = fileObj; // Add file data to form data
    }

    // Submit form data
    const scriptURL =
      "https://script.google.com/macros/s/AKfycbyjhAuJga8TdoWUApHtjgNarg9hGq9MyRMOM7gHCV4IbdvdA2d_BFU0CjS-fxuJ7sLQzQ/exec";

    const response = await fetch(scriptURL, {
      redirect: "follow",
      method: "POST",
      body: JSON.stringify(formDataObj),
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
    });

    const data = await response.json();

    if (data.status === "success") {
      submitButton.textContent = data.message || "Data submitted successfully!";
      submitButton.style.borderWidth = "0.2rem";
      submitButton.style.fontWeight = "800";
      submitButton.style.backgroundColor = "#18721d";
      submitButton.style.borderColor = "#0f5214";
      submitButton.style.color = "white";
      form.reset();
      fileNameDisplay.textContent = "No file selected";

      // Download SIM file based on SIM No. input
      const simNo = formDataObj["SIM No."];
      const simNum = parseInt(simNo, 10);

      if (Number.isInteger(simNum) && simNum >= 1 && simNum <= 10) {
        const numberToRoman = (num) => {
          const romanMap = [
            { value: 10, numeral: "X" },
            { value: 9, numeral: "IX" },
            { value: 5, numeral: "V" },
            { value: 4, numeral: "IV" },
            { value: 1, numeral: "I" },
          ];
          let roman = "";
          let n = parseInt(num, 10);
          for (let i = 0; i < romanMap.length; i++) {
            while (n >= romanMap[i].value) {
              roman += romanMap[i].numeral;
              n -= romanMap[i].value;
            }
          }
          return roman;
        };

        const romanNumeral = numberToRoman(simNum);
        const simFileName = `SIM ${romanNumeral}`;
        const simFileBase = `${simFileName} - (Answer Key Included).pdf`;
        const simFilePath = `./Answer Key/${simFileBase}`;
        const downloadLinkEl = document.getElementById("downloadAnswerKeyLink");
        const simFileDisplayEl = document.getElementById("simFileNameDisplay");
        if (simFileDisplayEl) simFileDisplayEl.textContent = simFileBase;

        fetch(encodeURI(simFilePath))
          .then((response) => {
            if (response.ok) return response.blob();
            console.warn(`SIM file not found: ${simFilePath}`);
            return null;
          })
          .then((blob) => {
            if (blob) {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = simFileBase;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);

              if (downloadLinkEl) {
                downloadLinkEl.href = url;
                downloadLinkEl.setAttribute("download", simFileBase);
                downloadLinkEl.textContent = `Download Answer Key (${simFileBase})`;
              }

              setTimeout(() => window.URL.revokeObjectURL(url), 300000);
            } else {
              if (downloadLinkEl) {
                downloadLinkEl.href = encodeURI(simFilePath);
                downloadLinkEl.setAttribute("download", simFileBase);
                downloadLinkEl.textContent = `Download Answer Key (${simFileBase})`;
              }
            }
          })
          .catch((error) => {
            console.warn("Error downloading SIM file:", error);
            if (downloadLinkEl) {
              downloadLinkEl.href = encodeURI(simFilePath);
              downloadLinkEl.setAttribute("download", simFileBase);
              downloadLinkEl.textContent = `Download Answer Key (${simFileBase})`;
            }
          });
      } else {
        console.warn("SIM No. out of range, skipping download");
      }
    } else {
      throw new Error(data.message || "Submission failed");
    }
  } catch (error) {
    console.error("Error:", error);
    submitButton.textContent = "Error: " + error.message;
    submitButton.style.fontWeight = "800";
    submitButton.style.backgroundColor = "#f14668";
    submitButton.style.color = "white";
  } finally {
    submitButton.disabled = false;
    submitButton.classList.remove("is-loading");

    setTimeout(() => {
      submitButton.textContent = "Submit Answer Sheet";
      submitButton.style.display = "block";
      submitButton.style.fontWeight = "400";
      submitButton.style.backgroundColor = "#f0f0f0";
      submitButton.style.borderColor = "#dbdbdb";
      submitButton.style.color = "black";
    }, 4000);
  }
});

const cancelButton = form.querySelector("button.is-danger");
cancelButton.addEventListener("click", function () {
  form.reset();
  fileNameDisplay.textContent = "No file selected";

  const simDisplay = document.getElementById("simFileNameDisplay");
  if (simDisplay) simDisplay.textContent = "";

  const dlLink = document.getElementById("downloadAnswerKeyLink");
  if (dlLink) {
    dlLink.textContent = "Download Answer Key";
  }
});

let url =
  "https://docs.google.com/spreadsheets/d/1bq94u1OZmLpOgHi0kXGelxN8R3lF0YlaHlyH_Z0Q1Co/gviz/tq?";
const output = document.querySelector(".output");
const query = encodeURIComponent("Select A, B, C, D");
console.log(query);
url = url + "&tq=" + query;

const tdObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const el = entry.target;
    if (!entry.isIntersecting && !el.classList.contains("standby")) {
      el.classList.add("standby");
      el.classList.remove("view");
    } else if (entry.isIntersecting && !el.classList.contains("view")) {
      el.classList.add("standby");
      setTimeout(() => {
        el.classList.remove("standby");
        el.classList.add("view");
      }, 100);
    }
  });
}, {});

fetch(url)
  .then((res) => res.text())
  .then((rep) => {
    const data = JSON.parse(rep.substr(47).slice(0, -2));
    let rowId = 0;

    const makeCell = (trId, colIndex, text, isFirst) => {
      const cell = document.createElement("td");
      cell.classList.add(`cell-${colIndex}`, "hidden-list");
      cell.textContent = text;
      tdObserver.observe(cell);
      return cell;
    };

    // header row
    const headerRowId = rowId++;
    const headerRow = document.createElement("tr");
    headerRow.id = `row-${headerRowId}`;
    headerRow.classList.add("row");
    headerRow.classList.add("hidden-list");
    output.append(headerRow);
    (data.table.cols || []).forEach((heading, colIndex) => {
      const label = heading && heading.label ? heading.label : "";
      const cell = makeCell(headerRowId, colIndex, label, colIndex === 0);
      headerRow.append(cell);
    });

    // data rows
    (data.table.rows || []).forEach((main) => {
      const currentRowId = rowId++;
      const container = document.createElement("tr");

      container.classList.add("row");
      container.id = `row-${currentRowId}`;
      container.classList.add("hidden-list");
      output.append(container);
      (main.c || []).forEach((ele, colIndex) => {
        const value = ele && ele.v !== undefined ? ele.v : "";
        const cell = makeCell(currentRowId, colIndex, value, colIndex === 0);
        container.append(cell);
      });
    });

    console.log(data);
    const lastRow = output.querySelector("tr:last-child");
    if (lastRow) {
      lastRow.style.opacity = "0";
    }
  });
