from gui import AssemblerGUI
from assembler_core import assemble


def main():
    """Main entry point for the SimpleRISC Assembler application."""
    # Launch the GUI
    app = AssemblerGUI()
    app.mainloop()


if __name__ == "__main__":
    # For console testing, you can run assembler directly:
    # assembly_sample = "your assembly code here"
    # try:
    #     mc = assemble(assembly_sample)
    #     for i, code in enumerate(mc):
    #         print(f"Addr {i:02}: {code:032b}  (0x{code:08X})")
    # except Exception as e:
    #     print("Error:", e)

    # Start the GUI application
    main()