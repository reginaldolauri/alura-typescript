import { Imprimivel } from "../models/Imprimivel";

export function imprime(...imprimiveis: Imprimivel[]){
    return imprimiveis.forEach(imprimivel => imprimivel.paraTexto());
}