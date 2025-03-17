"""
SimpleRISC Assembler - Main Module
This file is maintained for backward compatibility.
The functionality has been modularized into separate files:
- assembler_core.py: Core assembler functionality
- gui.py: GUI implementation
- main.py: Main entry point

For new usage, please import from the appropriate modules or run main.py directly.
"""

# Import functionality from modular structure
from assembler_core import assemble, opcodes
from gui import AssemblerGUI

# For backward compatibility, allow running this file directly
if __name__ == "__main__":
    import sys
    
    # If arguments are provided, treat as command line use
    if len(sys.argv) > 1:
        print("SimpleRISC Assembler - Command Line Mode")
        # Handle command line arguments here if needed in the future
        print("Please run main.py instead")
    else:
        # Start GUI
        print("SimpleRISC Assembler - Starting GUI")
        print("Note: It's recommended to run main.py directly")
        app = AssemblerGUI()
        app.mainloop()
