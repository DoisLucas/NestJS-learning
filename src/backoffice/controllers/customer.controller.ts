import { Controller, Get, Post, Body, Put, Delete, Param } from "@nestjs/common";
import { Customer } from "../models/customer.model";
import { Result } from "../models/result.model";

@Controller('v1/customers')
export class CustomerController {

    @Get()
    get() {
        return new Result(null, true, [], null);
    }

    @Get(':document')
    getById(@Param('document') document) {
        return new Result(null, true, {}, null);
    }

    @Post()
    post(@Body() body: Customer) {
        return new Result('Cliente criado com sucesso!', true, body, null);
    }

    @Put(':document')
    put(@Body() body, @Param('document') document) {
        return new Result('Cliente alterado com sucesso!', true, body, null);
    }

    @Delete(':document')
    delete(@Param('document') document) {
        return new Result('Cliente removido com sucesso!', true, null, null);
    }

}