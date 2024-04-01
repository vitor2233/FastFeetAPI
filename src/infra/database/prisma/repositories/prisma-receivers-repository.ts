import { ReceiversRepository } from "@/domain/delivery/application/repositories/receivers-repository";
import { Receiver } from "@/domain/delivery/enterprise/entities/receiver";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";

@Injectable()
export class PrismaReceiversRepository implements ReceiversRepository {
    constructor(
        private prisma: PrismaService
    ) { }

    async findById(id: string): Promise<Receiver> {
        throw new Error("Method not implemented.");
    }
    async create(receiver: Receiver): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async save(receiver: Receiver): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async delete(receiver: Receiver): Promise<void> {
        throw new Error("Method not implemented.");
    }

}