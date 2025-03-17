# SimpleRISC Assembler

A Python-based assembler for the SimpleRISC instruction set architecture, featuring both a command-line interface and graphical user interface.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Graphical User Interface](#graphical-user-interface)
  - [Command Line Interface](#command-line-interface)
- [Project Structure](#project-structure)
- [SimpleRISC Instruction Set](#simplerisc-instruction-set)
  - [Instruction Formats](#instruction-formats)
  - [Opcodes](#opcodes)
  - [Assembly Syntax](#assembly-syntax)
- [Examples](#examples)
- [Implementation Details](#implementation-details)
- [Contributing](#contributing)
- [License](#license)

## Overview

The SimpleRISC Assembler translates assembly language code written for the SimpleRISC architecture into machine code. It supports a variety of instruction formats and addressing modes, making it suitable for educational purposes and simple computer architecture demonstrations.

## Features

- **Graphical User Interface**: Easy-to-use interface for writing, loading, and saving assembly code
- **Syntax Highlighting**: Visual feedback for assembly code
- **Error Reporting**: Clear error messages for debugging
- **Label Support**: Symbolic addressing with labels
- **Multiple Addressing Modes**: Register and immediate addressing
- **32-bit Instruction Set**: Full support for the SimpleRISC 32-bit ISA

## Installation

### Prerequisites

- Python 3.6 or higher
- Tkinter (included with most Python installations)

### Setup

1. Clone the repository or download the source code
2. No additional dependencies are required beyond the standard Python library

```bash
git clone <repository-url>
cd Assembler_SimpleRisc
```

## Usage

### Graphical User Interface

To start the GUI application:

```bash
python main.py
```

The GUI provides:

- A text editor for entering assembly code
- Load and Save functionality for assembly files
- One-click assembly with visual machine code output
- Error reporting through dialog boxes

### Command Line Interface

For programmatic use, you can import the assembler function:

```python
from assembler_core import assemble

# Example assembly code
code = """
; Example program
mov r1, #10
mov r2, #20
add r3, r1, r2
"""

try:
    machine_code = assemble(code)
    for i, code in enumerate(machine_code):
        print(f"Addr {i:02}: {code:032b}  (0x{code:08X})")
except Exception as e:
    print("Error:", e)
```

## Project Structure

| File                | Description                                     |
| ------------------- | ----------------------------------------------- |
| `main.py`           | Entry point for the application                 |
| `gui.py`            | GUI implementation using Tkinter                |
| `assembler_core.py` | Core assembling functionality                   |
| `assembler.py`      | Legacy entry point (for backward compatibility) |

## SimpleRISC Instruction Set

The SimpleRISC architecture uses a 32-bit instruction format with the following instruction types:

### Instruction Formats

| Format             | Description                                                | Field Layout                                              |
| ------------------ | ---------------------------------------------------------- | --------------------------------------------------------- |
| Zero-Address       | Instructions with no operands (e.g., nop, ret)             | `[opcode(5)][unused(27)]`                                 |
| Branch             | Branch instructions with destination label (e.g., b, call) | `[opcode(5)][offset(27)]`                                 |
| Register-Register  | Three-address register instructions (e.g., add r1, r2, r3) | `[opcode(5)][mode(1)][rd(5)][rs1(5)][rs2(5)][unused(11)]` |
| Register-Immediate | Instructions with immediate values (e.g., add r1, r2, #10) | `[opcode(5)][mode(1)][rd(5)][rs1(5)][imm(16)]`            |
| Two-Address        | Operations with two operands (e.g., mov, cmp)              | `[opcode(5)][mode(1)][rd(5)][rs1(5/imm(21)]`              |
| Load/Store         | Memory access instructions (e.g., ld, st)                  | `[opcode(5)][mode(1)][rd(5)][rs1(5)][offset(16)]`         |

### Opcodes

| Instruction | Opcode (Binary) | Description                                    |
| ----------- | --------------- | ---------------------------------------------- |
| `mov`       | `01001`         | Move value between registers or load immediate |
| `add`       | `00000`         | Addition                                       |
| `sub`       | `00001`         | Subtraction                                    |
| `mul`       | `00010`         | Multiplication                                 |
| `div`       | `00011`         | Division                                       |
| `mod`       | `00100`         | Modulo operation                               |
| `cmp`       | `00101`         | Compare values                                 |
| `and`       | `00110`         | Bitwise AND                                    |
| `or`        | `00111`         | Bitwise OR                                     |
| `not`       | `01000`         | Bitwise NOT                                    |
| `lsl`       | `01010`         | Logical shift left                             |
| `lsr`       | `01011`         | Logical shift right                            |
| `asr`       | `01100`         | Arithmetic shift right                         |
| `ld`        | `01110`         | Load from memory                               |
| `st`        | `01111`         | Store to memory                                |
| `b`         | `10010`         | Unconditional branch                           |
| `call`      | `10011`         | Function call                                  |
| `ret`       | `10100`         | Return from function                           |
| `beq`       | `10000`         | Branch if equal                                |
| `bgt`       | `10001`         | Branch if greater than                         |
| `nop`       | `01101`         | No operation                                   |

### Assembly Syntax

The assembler supports the following syntax:

- **Labels**: Identifiers followed by a colon (e.g., `loop:`)
- **Comments**: Text following a semicolon (e.g., `; This is a comment`)
- **Registers**: `r0` through `r31`
- **Immediates**: Number sign followed by a value (e.g., `#42`)
- **Instruction formats**:
  - Zero-address: `opcode` (e.g., `nop`)
  - Branch: `opcode label` (e.g., `b loop`)
  - Three-address: `opcode rd, rs1, rs2` (e.g., `add r1, r2, r3`)
  - Register-immediate: `opcode rd, rs1, #imm` (e.g., `add r1, r2, #10`)
  - Two-address: `opcode rd, rs1` or `opcode rd, #imm` (e.g., `mov r1, r2` or `mov r1, #42`)
  - Load/Store: `opcode rd, rs1, offset` (e.g., `ld r1, r2, #4` or `st r1, r2, r3`)

## Examples

### Example 1: Simple Addition

```assembly
; Add two numbers and store the result
mov r1, #10     ; Load 10 into r1
mov r2, #20     ; Load 20 into r2
add r3, r1, r2  ; r3 = r1 + r2 (30)
```

### Example 2: Loop

```assembly
; Count down from 5 to 0
mov r1, #5      ; Initialize counter
loop:
sub r1, r1, #1  ; Decrement counter
cmp r1, #0      ; Compare with zero
bgt loop        ; Branch if greater than zero
```

## Implementation Details

### Two-Pass Assembly Process

The assembler uses a two-pass approach:

1. **First pass**: Collects all labels and their addresses
2. **Second pass**: Translates instructions to machine code, resolving label references

### Instruction Encoding

The assembler encodes instructions in a 32-bit format:

- 5 bits for opcode
- 1 bit for addressing mode (0 for register, 1 for immediate)
- Remaining bits for operands and other fields based on instruction type

## Contributing

Contributions to improve the SimpleRISC Assembler are welcome. Please feel free to submit a Pull Request.

## License

This project is available under the MIT License.
