# SimpleRISC Assembler (Web Version)

A web-based assembler for the SimpleRISC instruction set architecture, designed to run entirely in the browser.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Usage](#usage)
  - [Online Access](#online-access)
  - [Local Development](#local-development)
- [Project Structure](#project-structure)
- [SimpleRISC Instruction Set](#simplerisc-instruction-set)
  - [Instruction Formats](#instruction-formats)
  - [Opcodes](#opcodes)
  - [Assembly Syntax](#assembly-syntax)
- [Examples](#examples)
- [Implementation Details](#implementation-details)
- [Contributing](#contributing)

## Overview

The SimpleRISC Assembler translates assembly language code written for the SimpleRISC architecture into machine code. This web version runs entirely client-side, making it easily accessible from any browser.

## Features

- **Web-Based Interface**: Use the assembler from any browser without installation
- **Real-time Assembly**: Convert assembly code to machine code with immediate feedback
- **File Operations**: Load and save assembly code files
- **Error Reporting**: Clear error messages for debugging
- **Label Support**: Symbolic addressing with labels
- **Multiple Addressing Modes**: Register and immediate addressing
- **32-bit Instruction Set**: Full support for the SimpleRISC 32-bit ISA

## Usage

### Online Access

Access the SimpleRISC Assembler directly in your browser:

1. Go to [https://kevin-eleven.github.io/Assembler_SimpleRisc](https://kevin-eleven.github.io/Assembler_SimpleRisc)
2. Enter your assembly code in the editor
3. Click "Assemble" to convert it to machine code
4. Use the "Load" and "Save" buttons to manage your assembly files

### Local Development

To run or modify the assembler locally:

1. Clone the repository

   ```bash
   git clone https://github.com/kevin-eleven/Assembler_SimpleRisc.git
   cd Assembler_SimpleRisc
   ```

2. Open `index.html` in your browser to use the assembler

3. For development, you can use any local server.

## Project Structure

| File/Directory    | Description                                 |
| ----------------- | ------------------------------------------- |
| `index.html`      | Main HTML file with the web interface       |
| `css/style.css`   | Styling for the web application             |
| `js/assembler.js` | Core assembling functionality in JavaScript |
| `js/app.js`       | UI interaction handling                     |

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

### Browser-Based Execution

The assembler runs entirely client-side:

1. JavaScript parses the assembly code
2. A two-pass algorithm is used:
   - First pass: Collects all labels and their addresses
   - Second pass: Translates instructions to machine code, resolving label references
3. Results are displayed directly in the browser

### Instruction Encoding

The assembler encodes instructions in a 32-bit format:

- 5 bits for opcode
- 1 bit for addressing mode (0 for register, 1 for immediate)
- Remaining bits for operands and other fields based on instruction type

## Contributing

Contributions to improve the SimpleRISC Assembler are welcome. Please feel free to submit a Pull Request to the [GitHub repository](https://github.com/yourusername/Assembler_SimpleRisc).
