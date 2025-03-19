// SimpleRISC Assembler - JavaScript Implementation

// Define 5-bit opcodes for a 32-bit SimpleRISC ISA
const opcodes = {
  mov: 0b01001,
  add: 0b00000,
  sub: 0b00001,
  mul: 0b00010,
  div: 0b00011,
  mod: 0b00100,
  cmp: 0b00101,
  and: 0b00110,
  or: 0b00111,
  not: 0b01000,
  lsl: 0b01010,
  lsr: 0b01011,
  asr: 0b01100,
  ld: 0b01110,
  st: 0b01111,
  b: 0b10010,
  call: 0b10011,
  ret: 0b10100,
  beq: 0b10000,
  bgt: 0b10001,
  nop: 0b01101,
};

/**
 * Assembles SimpleRISC assembly code into machine code.
 * @param {string} assemblyCode - The assembly code as a string
 * @returns {Array} - An array of 32-bit integers representing the machine code
 * @throws {Error} - If there's an error in the assembly process
 */
function assemble(assemblyCode) {
  const symbolTable = {};

  // Remove comments (assuming ';' style) and blank lines
  const lines = [];
  const assemblyLines = assemblyCode.split("\n");
  for (const line of assemblyLines) {
    // Remove comments and trim whitespace
    const cleanLine = line.split(";")[0].trim();
    if (cleanLine) {
      lines.push(cleanLine);
    }
  }

  let machineCode = [];
  let address = 0; // Instruction counter

  // First Pass: Build symbol table for labels
  for (const line of lines) {
    if (line.endsWith(":")) {
      const label = line.slice(0, -1);
      symbolTable[label] = address;
    } else {
      address += 1;
    }
  }

  // Second Pass: Assemble instructions
  address = 0;
  for (const line of lines) {
    if (line.endsWith(":")) {
      continue; // Skip label definitions
    }

    const tokens = line.split(/[\s,]+/).filter((token) => token.length > 0);
    const op = tokens[0];
    const operands = tokens.slice(1);

    let code = 0;

    // Zero-Address Instructions (nop, ret)
    if (["nop", "ret"].includes(op)) {
      code = opcodes[op] << 27; // 5-bit opcode in bits 27-31
    }
    // Branch Instructions (b, beq, bgt, call)
    else if (["b", "beq", "bgt", "call"].includes(op)) {
      const targetLabel = operands[0];
      if (!(targetLabel in symbolTable)) {
        throw new Error(`Undefined label: ${targetLabel}`);
      }
      const targetAddr = symbolTable[targetLabel];
      // PC-relative offset in bytes
      const offset = (targetAddr - address) * 4;
      code = (opcodes[op] << 27) | (offset & 0x07ffffff); // 27-bit offset
    }
    // Three-Address Register Instructions (add, sub, mul, and, or, lsl, lsr, asr)
    else if (
      ["add", "sub", "mul", "and", "or", "lsl", "lsr", "asr"].includes(op)
    ) {
      const rd = parseInt(operands[0].substring(1)); // Destination register
      const rs1 = parseInt(operands[1].substring(1)); // First source register

      // Check if the third operand is an immediate
      if (operands[2].startsWith("#")) {
        const imm = parseInt(operands[2].substring(1)); // Extract the immediate value
        code =
          (opcodes[op] << 27) | // 5-bit opcode
          (1 << 26) | // Mode: 1 for immediate
          (rd << 21) | // rd in bits 21-25
          (rs1 << 16) | // rs1 in bits 16-20
          (imm & 0xffff); // 16-bit immediate value
      } else {
        // Register-to-register mode
        const rs2 = parseInt(operands[2].substring(1));
        code =
          (opcodes[op] << 27) | // 5-bit opcode
          (0 << 26) | // Mode: 0 for register
          (rd << 21) | // rd in bits 21-25
          (rs1 << 16) | // rs1 in bits 16-20
          (rs2 << 11); // rs2 in bits 11-15
      }
    }
    // Two-Address Instructions (cmp, not, mov)
    else if (["cmp", "not", "mov"].includes(op)) {
      const rd = parseInt(operands[0].substring(1));
      if (operands[1].startsWith("#")) {
        // Immediate mode
        const imm = parseInt(operands[1].substring(1));
        code =
          (opcodes[op] << 27) | // 5-bit opcode
          (1 << 26) | // Mode: 1 = immediate
          (rd << 21) | // rd field
          (imm & 0x1fffff); // 21-bit immediate value
      } else {
        // Register mode
        const rs1 = parseInt(operands[1].substring(1));
        code =
          (opcodes[op] << 27) | // 5-bit opcode
          (0 << 26) | // Mode: 0 = register
          (rd << 21) | // rd field
          (rs1 << 16); // rs1 field in bits 16-20
      }
    }
    // Load/Store Instructions (ld, st)
    else if (["ld", "st"].includes(op)) {
      const rd = parseInt(operands[0].substring(1));
      const rs1 = parseInt(operands[1].substring(1));
      if (operands[2].startsWith("#")) {
        // Immediate offset
        const imm = parseInt(operands[2].substring(1));
        code =
          (opcodes[op] << 27) | // opcode
          (1 << 26) | // Mode: immediate
          (rd << 21) | // rd field
          (rs1 << 16) | // rs1 field
          (imm & 0xffff); // 16-bit offset
      } else {
        // Register offset
        const rs2 = parseInt(operands[2].substring(1));
        code =
          (opcodes[op] << 27) | // opcode
          (0 << 26) | // Mode: register
          (rd << 21) | // rd field
          (rs1 << 16) | // rs1 field
          (rs2 << 11); // rs2 field in bits 11-15
      }
    } else {
      throw new Error(`Invalid instruction: ${op}`);
    }

    machineCode.push(code);
    address += 1;
  }

  return machineCode;
}
