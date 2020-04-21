import { Controller, Get, Post, Body, Put, Delete, Param, UseInterceptors, HttpException, HttpStatus } from "@nestjs/common";
import { Result } from "../models/result.model";
import { ValidatorInterceptor } from "src/interceptors/validator.interceptor";
import { Pet } from "../models/pet.model";
import { CreatePetContract } from "../contracts/pet/create-pet-contract";
import { PetService } from "../services/pet.services";

@Controller('v1/pets')
export class PetController {

    constructor(private readonly service: PetService) {
    }

    @Post(':document/pets')
    @UseInterceptors(new ValidatorInterceptor(new CreatePetContract()))
    async createPet(@Param('document') document, @Body() model: Pet) {
        try {
            await this.service.create(document, model);
            throw new Result(null, true, model, null);
        } catch (error) {
            throw new HttpException(new Result('Não foi possivel criar seu pet', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }

    @Put(':document/pets/:id')
    @UseInterceptors(new ValidatorInterceptor(new CreatePetContract()))
    async updatePet(@Param('document') document, @Param('id') id, @Body() model: pet) {
        try {
            await this.service.update(document, id, model);
            throw new Result(null, true, model, null);
        } catch (error) {
            throw new HttpException(new Result('Não foi possivel atualizar seu pet', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }

}