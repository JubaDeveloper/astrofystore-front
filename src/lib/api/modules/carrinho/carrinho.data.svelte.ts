import type { CupomResponseDto } from "../cupom/cupom.dto"

class CarrinhoData{
    cupomAplicado = $state<CupomResponseDto | undefined >()
}

const carrinhoData = new CarrinhoData()

export default carrinhoData