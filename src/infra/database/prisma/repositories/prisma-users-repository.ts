import { UsersRepository } from "@/domain/delivery/application/repositories/users-repository";
import { User } from "@/domain/delivery/enterprise/entities/user";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { PrismaUserMapper } from "../mappers/prisma-user-mapper";

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
    constructor(
        private prisma: PrismaService
    ) { }

    async findByCpf(cpf: string): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: {
                cpf
            }
        })

        if (!user) {
            return null
        }

        return PrismaUserMapper.toDomain(user);
    }
    async findById(id: string): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: {
                id
            }
        })

        if (!user) {
            return null
        }

        return PrismaUserMapper.toDomain(user);
    }

    async create(user: User): Promise<void> {
        await this.prisma.user.create({
            data: PrismaUserMapper.toPrisma(user)
        })
    }

    async save(user: User): Promise<void> {
        await this.prisma.user.update({
            where: { id: user.id.toString() },
            data: PrismaUserMapper.toPrisma(user)
        })
    }

    async delete(user: User): Promise<void> {
        await this.prisma.user.delete({
            where: { id: user.id.toString() }
        })
    }

}