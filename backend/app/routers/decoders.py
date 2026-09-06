from fastapi import APIRouter

router = APIRouter(prefix="/decoders", tags=["Decoders"])

@router.get("")
async def get_decoders():
    return {
        "supported_programs": [
            {
                "name": "System Program",
                "program_id": "11111111111111111111111111111111",
                "status": "Active",
                "instructions_supported": ["CreateAccount", "Assign", "Transfer", "Allocate", "AuthorizeNonceAccount"]
            },
            {
                "name": "SPL Token Program",
                "program_id": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                "status": "Active",
                "instructions_supported": ["Transfer", "TransferChecked", "MintTo", "Burn", "InitializeAccount", "CloseAccount"]
            },
            {
                "name": "Token Extensions (Token-2022)",
                "program_id": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
                "status": "Active",
                "instructions_supported": ["TransferChecked", "TransferFeeExtension", "MintToChecked", "BurnChecked"]
            },
            {
                "name": "Jupiter Routing v6",
                "program_id": "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4",
                "status": "Active",
                "instructions_supported": ["route", "exactOutRoute", "sharedAccountsRoute", "swap"]
            },
            {
                "name": "Raydium Liquidity Pool V4",
                "program_id": "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
                "status": "Active",
                "instructions_supported": ["swapBaseIn", "swapBaseOut", "deposit", "withdraw"]
            }
        ],
        "how_to_add_decoder": {
            "step_1": "Implement ProgramDecoder interface in indexer/src/decoders/<your_protocol>.ts",
            "step_2": "Register your class in indexer/src/decoders/registry.ts",
            "step_3": "Open a pull request on GitHub to be merged into main"
        }
    }
