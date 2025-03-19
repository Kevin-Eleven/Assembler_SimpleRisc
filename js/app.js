/*
 * SimpleRISC Assembler - Web Interface
 */

document.addEventListener("DOMContentLoaded", function () {
  // DOM elements
  const inputArea = document.getElementById("input-area");
  const outputArea = document.getElementById("output-area");
  const assembleBtn = document.getElementById("assemble-btn");
  const loadBtn = document.getElementById("load-btn");
  const saveBtn = document.getElementById("save-btn");
  const fileInput = document.getElementById("file-input");

  // Disable spell checking for code input
  inputArea.setAttribute("spellcheck", "false");

  // Set initial content
  inputArea.value =
    "; Enter your assembly code here\n\n; Example:\n\n; Hash(#) sign followed by a number is used to represent immediate values\n\n; Simple addition\nmov r1, #10\nmov r2, #20\nadd r3, r1, r2";

  assembleBtn.addEventListener("click", function () {
    const assemblyCode = inputArea.value;
    outputArea.value = "";

    try {
      const machineCode = assemble(assemblyCode);

      for (let i = 0; i < machineCode.length; i++) {
        const code = machineCode[i];
        // Format the output like the original Python version
        outputArea.value += `Addr ${i.toString().padStart(2, "0")}: ${code
          .toString(2)
          .padStart(32, "0")}  (0x${code
          .toString(16)
          .toUpperCase()
          .padStart(8, "0")})\n`;
      }
    } catch (error) {
      outputArea.value = `Assembly Error: ${error.message}`;
    }
  });

  loadBtn.addEventListener("click", function () {
    fileInput.click();
  });

  fileInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      inputArea.value = e.target.result;
    };
    reader.readAsText(file);
  });

  saveBtn.addEventListener("click", function () {
    const code = inputArea.value;
    const blob = new Blob([code], { type: "text/plain" });
    const link = document.createElement("a");

    link.download = "assembly_code.asm";
    link.href = window.URL.createObjectURL(blob);
    link.click();
  });
});
