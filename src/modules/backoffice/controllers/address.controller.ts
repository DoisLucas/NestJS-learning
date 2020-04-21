import { Controller, Get, Post, Body, Put, Delete, Param, UseInterceptors, HttpException, HttpStatus } from "@nestjs/common";
import { Result } from "../models/result.model";
import { ValidatorInterceptor } from "src/interceptors/validator.interceptor";
import { Address } from "../models/address.model";
import { CreateAddressContract } from "../contracts/address/create-address.contract";
import { AddressService } from "../services/address.service";
import { AddressType } from "../enums/address-type.enum";

@Controller('v1/addresses')
export class AddressController {

    constructor(private readonly service: AddressService) {
    }

    @Post(':document/billing')
    @UseInterceptors(new ValidatorInterceptor(new CreateAddressContract()))
    async addBillingAddress(@Param('document') document, @Body() model: Address) {
        try {
            await this.service.create(document, model, AddressType.Billing);
            throw new Result(null, true, model, null);
        } catch (error) {
            throw new HttpException(new Result('Não foi possivel adicionar seu endereço', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }

    @Post(':document/shipping')
    @UseInterceptors(new ValidatorInterceptor(new CreateAddressContract()))
    async addShippingAddress(@Param('document') document, @Body() model: Address) {
        try {
            await this.service.create(document, model, AddressType.Shipping);
            throw new Result(null, true, model, null);
        } catch (error) {
            throw new HttpException(new Result('Não foi possivel adicionar seu endereço', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }

}