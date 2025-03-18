/**
 * SimpleRISC Assembler - Web Interface
 *
 * This file handles the user interface interactions for the SimpleRISC assembler web app.
 */

document.addEventListener("DOMContentLoaded", function () {
  // DOM elements
  const inputArea = document.getElementById("input-area");
  const outputArea = document.getElementById("output-area");
  const assembleBtn = document.getElementById("assemble-btn");
  const loadBtn = document.getElementById("load-btn");
  const saveBtn = document.getElementById("save-btn");
  const fileInput = document.getElementById("file-input");

  // Set initial content
  inputArea.value =
    "; Enter your assembly code here\n\n; Example:\n; Simple addition\nmov r1, #10\nmov r2, #20\nadd r3, r1, r2";

  // Handle the assemble button click
  assembleBtn.addEventListener("click", function () {
    const assemblyCode = inputArea.value;
    outputArea.value = ""; // Clear previous output

    try {
      const machineCode = assemble(assemblyCode);
      // Display the machine code in the output area
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
      // Show error message in the output area
      outputArea.value = `Assembly Error: ${error.message}`;
    }
  });

  // Handle the load button click
  loadBtn.addEventListener("click", function () {
    fileInput.click();
  });

  // Handle file selection
  fileInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      inputArea.value = e.target.result;
    };
    reader.readAsText(file);
  });

  // Handle the save button click
  saveBtn.addEventListener("click", function () {
    const code = inputArea.value;
    const blob = new Blob([code], { type: "text/plain" });
    const link = document.createElement("a");

    link.download = "assembly_code.asm";
    link.href = window.URL.createObjectURL(blob);
    link.click();
  });
});
