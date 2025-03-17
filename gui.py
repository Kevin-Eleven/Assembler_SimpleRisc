import tkinter as tk
from tkinter import scrolledtext, messagebox, filedialog
from assembler_core import assemble

class AssemblerGUI(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("SimpleRISC Assembler")
        self.geometry("800x600")

        # Create a menu
        menubar = tk.Menu(self)
        filemenu = tk.Menu(menubar, tearoff=0)
        filemenu.add_command(label="Open", command=self.load_file)
        filemenu.add_command(label="Save", command=self.save_file)
        menubar.add_cascade(label="File", menu=filemenu)
        self.config(menu=menubar)

        # Assembly code input area
        self.input_area = scrolledtext.ScrolledText(self, width=80, height=15)
        self.input_area.pack(pady=10)
        self.input_area.insert(tk.END, "; Enter your assembly code here\n")

        # Assemble button
        self.assemble_button = tk.Button(
            self, text="Assemble", command=self.run_assembler)
        self.assemble_button.pack(pady=5)

        # Output area for machine code
        self.output_area = scrolledtext.ScrolledText(self, width=80, height=15)
        self.output_area.pack(pady=10)
        self.output_area.insert(
            tk.END, "; Machine code output will appear here\n")

    def load_file(self):
        filepath = filedialog.askopenfilename(title="Open Assembly File", filetypes=[
                                              ("Assembly Files", ".asm"), ("All Files", ".*")])
        if filepath:
            with open(filepath, "r") as f:
                code = f.read()
            self.input_area.delete("1.0", tk.END)
            self.input_area.insert(tk.END, code)

    def save_file(self):
        filepath = filedialog.asksaveasfilename(title="Save Assembly File", defaultextension=".asm", filetypes=[
                                                ("Assembly Files", ".asm"), ("All Files", ".*")])
        if filepath:
            with open(filepath, "w") as f:
                # Strip extra newline
                f.write(self.input_area.get("1.0", tk.END).strip())
            messagebox.showinfo("Save File", "File saved successfully.")

    def run_assembler(self):
        asm_code = self.input_area.get("1.0", tk.END)
        try:
            machine_code = assemble(asm_code)
            self.output_area.delete("1.0", tk.END)
            for i, code in enumerate(machine_code):
                line = f"Addr {i:02}: {code:032b}  (0x{code:08X})\n"
                self.output_area.insert(tk.END, line)
        except Exception as e:
            messagebox.showerror("Assembly Error", str(e))