const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");

// Load saved files from localStorage
let savedFiles = JSON.parse(localStorage.getItem("files")) || [];
renderFiles();

// Handle file selection
fileInput.addEventListener("change", handleFiles);
dropZone.addEventListener("click", () => fileInput.click());

// Handle drag & drop
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.style.borderColor = "#1a73e8";
});

dropZone.addEventListener("dragleave", () => {
  dropZone.style.borderColor = "#dadce0";
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.style.borderColor = "#dadce0";
  handleFiles({ target: { files: e.dataTransfer.files } });
});

function handleFiles(event) {
  const files = event.target.files;
  for (let file of files) {
    const reader = new FileReader();
    reader.onload = function(e) {
      savedFiles.push({ name: file.name, data: e.target.result });
      localStorage.setItem("files", JSON.stringify(savedFiles));
      renderFiles();
    };
    reader.readAsDataURL(file); // Convert file to Base64
  }
}

function renderFiles() {
  fileList.innerHTML = "";
  savedFiles.forEach((file, index) => {
    const card = document.createElement("div");
    card.className = "file-card";
    card.innerHTML = `
      <div class="file-name">${file.name}</div>
      <div class="file-actions">
        <a href="${file.data}" download="${file.name}" class="file-link">Download</a>
        <button class="delete-btn" data-index="${index}">Delete</button>
      </div>
    `;
    fileList.appendChild(card);
  });

  // Attach delete events
  document.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      deleteFile(index);
    });
  });
}

function deleteFile(index) {
  savedFiles.splice(index, 1);
  localStorage.setItem("files", JSON.stringify(savedFiles));
  renderFiles();
}