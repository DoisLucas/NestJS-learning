import { Module, CacheModule, HttpModule } from '@nestjs/common';
import { CustomerController } from './controllers/customer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerSchema } from './schemas/customer.schema';
import { UserSchema } from './schemas/user.schemas';
import { AccountService } from './services/account.service';
import { CustomerService } from './services/customer.service';
import { AddressService } from './services/address.service';
import { PetService } from './services/pet.services';
import { AddressController } from './controllers/address.controller';
import { PetController } from './controllers/pet.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/shared/services/auth.service';
import { JwtStrategy } from 'src/shared/strategies/jwt.strategy';
import { AccountController } from './controllers/account.controller';

@Module({
    imports: [
        HttpModule,
        CacheModule.register(),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: 'homemaranha',
            signOptions: {
                expiresIn: 3600,
            },
        }),
        MongooseModule.forFeature(
            [
                {
                    name: 'Customer',
                    schema: CustomerSchema,
                },
                {
                    name: 'User',
                    schema: UserSchema,
                },
            ]
        )],
    controllers:
        [
            AccountController,
            AddressController,
            PetController,
            CustomerController
        ],
    providers:
        [
            AccountService,
            CustomerService,
            AddressService,
            PetService,
            AuthService,
            JwtStrategy
        ],
})
export class BackofficeModule { }
