import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { UsersRepository } from "@/domain/delivery/application/repositories/users-repository";


@Module({
    imports: [],
    providers: [


    ],
    exports: [
        PrismaService,
    ]
})
export class DatabaseModule { }