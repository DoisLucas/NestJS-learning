import { Flunt } from "src/utils/flunt";
import { Contract } from "./contract";
import { Customer } from "../models/customer.model";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateCustomerContract implements Contract {
    erros: any[];
    validate(model: Customer): boolean {
        const flunt = new Flunt();
        flunt.hasMaxLen(model.name, 20, 'Nome inválido');
        flunt.isEmail(model.email, "E-mail inválido");
        flunt.isFixedLen(model.document, 11, "Documento inválido");
        flunt.hasMinLen(model.password, 6, 'Senha Inválida');
        this.erros = flunt.errors;
        return flunt.isValid();
    }


}