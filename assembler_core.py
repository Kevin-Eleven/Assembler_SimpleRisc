import re

# Define 5-bit opcodes for a 32-bit SimpleRISC ISA
opcodes = {
    "mov": 0b01001, "add": 0b00000, "sub": 0b00001, "mul": 0b00010,
    "div": 0b00011, "mod": 0b00100, "cmp": 0b00101, "and": 0b00110,
    "or": 0b00111, "not": 0b01000, "lsl": 0b01010, "lsr": 0b01011,
    "asr": 0b01100, "ld": 0b01110, "st": 0b01111, "b": 0b10010,
    "call": 0b10011, "ret": 0b10100, "beq": 0b10000, "bgt": 0b10001,
    "nop": 0b01101
}


def assemble(assembly_code):
    """
    Assembles SimpleRISC assembly code into machine code.
    
    Args:
        assembly_code (str): The assembly code as a string
        
    Returns:
        list: A list of 32-bit integers representing the machine code
    """
    symbol_table = {}
    # Remove comments (assuming ';' style) and blank lines
    lines = []
    for line in assembly_code.split('\n'):
        # remove comments and trim whitespace
        line = line.split(';')[0].strip()
        if line:
            lines.append(line)

    machine_code = []
    address = 0  # Instruction counter

    # First Pass: Build symbol table for labels
    for line in lines:
        if line.endswith(':'):
            label = line[:-1]
            symbol_table[label] = address
        else:
            address += 1

    # Second Pass: Assemble instructions
    address = 0
    for line in lines:
        if line.endswith(':'):
            continue  # Skip label definitions

        tokens = re.split(r'[\s,]+', line)
        op = tokens[0]
        operands = tokens[1:]

        code = 0
        # Zero-Address Instructions (nop, ret)
        if op in ["nop", "ret"]:
            code = opcodes[op] << 27  # 5-bit opcode in bits 27-31

            # Branch Instructions (b, beq, bgt, call)
        elif op in ["b", "beq", "bgt", "call"]:
            target_label = operands[0]
            if target_label not in symbol_table:
                raise ValueError(f"Undefined label: {target_label}")
            target_addr = symbol_table[target_label]
            # PC-relative offset in bytes
            offset = (target_addr - address) * 4
            code = (opcodes[op] << 27) | (offset & 0x07FFFFFF)  # 27-bit offset

            # Three-Address Register Instructions (add, sub, mul, and, or, lsl, lsr, asr)
        elif op in ["add", "sub", "mul", "and", "or", "lsl", "lsr", "asr"]:
            rd = int(operands[0][1:])   # Destination register
            rs1 = int(operands[1][1:])  # First source register
                # Check if the third operand is an immediate
            if operands[2].startswith("#"):
                imm = int(operands[2][1:])  # Extract the immediate value
                code = (
                    (opcodes[op] << 27) |  # 5-bit opcode
                    (1 << 26) |            # Mode: 1 for immediate
                    (rd << 21) |           # rd in bits 21-25
                    (rs1 << 16) |          # rs1 in bits 16-20
                    (imm & 0xFFFF)         # 16-bit immediate value
                )
            else:  # Register-to-register mode (original code)
                rs2 = int(operands[2][1:])
                code = (
                    (opcodes[op] << 27) |  # 5-bit opcode
                    (0 << 26) |            # Mode: 0 for register
                    (rd << 21) |           # rd in bits 21-25
                    (rs1 << 16) |          # rs1 in bits 16-20
                    (rs2 << 11)            # rs2 in bits 11-15
                )
            # Two-Address Instructions (cmp, not, mov)
        elif op in ["cmp", "not", "mov"]:
            rd = int(operands[0][1:])
            if operands[1].startswith("#"):  # Immediate mode
                imm = int(operands[1][1:])
                code = (
                    (opcodes[op] << 27) |    # 5-bit opcode
                    (1 << 26) |              # Mode: 1 = immediate
                    (rd << 21) |             # rd field
                    (imm & 0x1FFFFF)         # 21-bit immediate value
                )
            else:  # Register mode
                rs1 = int(operands[1][1:])
                code = (
                    (opcodes[op] << 27) |    # 5-bit opcode
                    (0 << 26) |              # Mode: 0 = register
                    (rd << 21) |             # rd field
                    (rs1 << 16)              # rs1 field in bits 16-20
                )

            # Load/Store Instructions (ld, st)
        elif op in ["ld", "st"]:
            rd = int(operands[0][1:])
            rs1 = int(operands[1][1:])
            if operands[2].startswith("#"):  # Immediate offset
                imm = int(operands[2][1:])
                code = (
                    (opcodes[op] << 27) |    # opcode
                    (1 << 26) |              # Mode: immediate
                    (rd << 21) |             # rd field
                    (rs1 << 16) |            # rs1 field
                    (imm & 0xFFFF)           # 16-bit offset
                )
            else:  # Register offset
                rs2 = int(operands[2][1:])
                code = (
                    (opcodes[op] << 27) |    # opcode
                    (0 << 26) |              # Mode: register
                    (rd << 21) |             # rd field
                    (rs1 << 16) |            # rs1 field
                    (rs2 << 11)              # rs2 field in bits 11-15
                )

        else:
            raise ValueError(f"Invalid instruction: {op}")
        machine_code.append(code)
        address += 1
    return machine_code