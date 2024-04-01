import { UsersRepository } from "@/domain/delivery/application/repositories/users-repository";
import { User } from "@/domain/delivery/enterprise/entities/user";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
    constructor(
        private prisma: PrismaService
    ) { }

    async findByCpf(cpf: string): Promise<User> {
        throw new Error("Method not implemented.");
    }
    async findById(id: string): Promise<User> {
        throw new Error("Method not implemented.");
    }
    async create(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async save(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async delete(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }

}