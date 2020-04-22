import { Body, CacheInterceptor, Controller, Get, HttpException, HttpStatus, Param, Post, Put, UseInterceptors } from "@nestjs/common";
import { Md5 } from 'md5-typescript';
import { ValidatorInterceptor } from "src/interceptors/validator.interceptor";
import { CreateCreditCardContract } from "../contracts/customer/create-credit-card.contract";
import { CreateCustomerContract } from "../contracts/customer/create-customer.contract";
import { UpdateCustomerContract } from "../contracts/customer/update-customer.contract";
import { QueryContract } from "../contracts/query.contract";
import { CreateCustomerDto } from "../dtos/customer/create-customer.dto";
import { UpdateCustomerDto } from "../dtos/customer/update-customer.dto";
import { QueryDto } from "../dtos/query.dto";
import { CreditCard } from "../models/credit-card.model";
import { Customer } from "../models/customer.model";
import { Result } from "../models/result.model";
import { User } from "../models/user.models";
import { AccountService } from "../services/account.service";
import { CustomerService } from "../services/customer.service";

@Controller('v1/customers')
export class CustomerController {

    constructor(private readonly accountService: AccountService,
        private readonly customerService: CustomerService) {
    }


    @Post()
    @UseInterceptors(new ValidatorInterceptor(new CreateCustomerContract()))
    async post(@Body() model: CreateCustomerDto) {
        try {
            const password = await Md5.init(`${model.password}SALT_KEYENV`);
            const user = await this.accountService.create(new User(model.document, password, true, ['user']));
            const customer = new Customer(model.name, model.document, model.email, null, null, null, null, user);
            const res = await this.customerService.create(customer);
            return new Result('Cliente criado com sucesso!', true, res, null);
        } catch (error) {
            //Rollback manual
            throw new HttpException(new Result('Não foi possivel realizar seu cadastro', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }


    @Put()
    @UseInterceptors(new ValidatorInterceptor(new UpdateCustomerContract()))
    async update(@Param('document') document, @Body() model: UpdateCustomerDto) {
        try {
            await this.customerService.update(document, model);
            return new Result(null, true, model, null);
        } catch (error) {
            throw new HttpException(new Result('Não foi possivel atualizar seu cadastro', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }

    @Get()
    @UseInterceptors(CacheInterceptor)
    async getAll() {
        const customers = await this.customerService.findAll();
        return new Result(null, true, customers, null);
    }

    @Get(':document')
    async get(@Param('document') document) {
        const customer = await this.customerService.find(document);
        throw new Result(null, true, customer, null);
    }

    @Post('query')
    @UseInterceptors(new ValidatorInterceptor(new QueryContract()))
    async query(@Body() model: QueryDto) {
        const customers = await this.customerService.query(model);
        return new Result(null, true, customers, null);
    }

    @Post(':document/credit-cards')
    @UseInterceptors(new ValidatorInterceptor(new CreateCreditCardContract()))
    async createCreditCard(@Param('document') document, @Body() model: CreditCard) {
        try {
            await this.customerService.saveOrUpdateCreditCard(document, model);
            return new Result(null, true, model, null);
        } catch (error) {
            throw new HttpException(new Result('Não foi possível adicionar seu cartão de crédito', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }
}