import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { User } from '../models/user.models';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from '../models/customer.model';
import { Md5 } from 'md5-typescript';

@Injectable()
export class AccountService {

    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('Customer') private readonly customerModel: Model<Customer>
    ) {
    }

    async create(data: User): Promise<User> {
        const user = new this.userModel(data);
        return await user.save();
    }

    async update(username: string, data: any): Promise<User> {
        return await this.userModel.findOnAndUpdate({ username }, data);
    }

    async authenticate(username, password): Promise<Customer> {
        var customer = await this.customerModel
            .findOne({ document: document })
            .populate('user', '-password')
            .exec();

        const pass = await Md5.init(`${password}SALT_KEYENV`);
        if (pass.toString() == customer.user.password.toString()) {
            return customer;
        } else {
            return null;
        }

    }

}