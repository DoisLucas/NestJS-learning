import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UseInterceptors } from "@nestjs/common";
import { ValidatorInterceptor } from "src/interceptors/validator.interceptor";
import { CreateAddressContract } from "../contracts/address/create-address.contract";
import { AddressType } from "../enums/address-type.enum";
import { Address } from "../models/address.model";
import { Result } from "../models/result.model";
import { AddressService } from "../services/address.service";

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

    @Get('search/:zipcode')
    async search(@Param('zipcode') zipcode) {
        try {
            const response = await this.service.getAddressByZipCode(zipcode).toPromise();
            return new Result(null, true, response.data, null);
        } catch (error) {
            throw new HttpException(new Result('Não foi possível localizar seu endereço', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }

}