import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { UsersRepository } from "@/domain/delivery/application/repositories/users-repository";
import { PrismaUsersRepository } from "./prisma/repositories/prisma-users-repository";
import { ReceiversRepository } from "@/domain/delivery/application/repositories/receivers-repository";
import { PrismaReceiversRepository } from "./prisma/repositories/prisma-receivers-repository";
import { OrdersRepository } from "@/domain/delivery/application/repositories/orders-repository";
import { PrismaOrdersRepository } from "./prisma/repositories/prisma-orders-repository";


@Module({
    imports: [],
    providers: [
        PrismaService,
        {
            provide: UsersRepository,
            useClass: PrismaUsersRepository
        },
        {
            provide: ReceiversRepository,
            useClass: PrismaReceiversRepository
        },
        {
            provide: OrdersRepository,
            useClass: PrismaOrdersRepository
        }

    ],
    exports: [
        PrismaService,
        OrdersRepository,
        UsersRepository,
        ReceiversRepository
    ]
})
export class DatabaseModule { }