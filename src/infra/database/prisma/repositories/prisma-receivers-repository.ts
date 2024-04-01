import { ReceiversRepository } from "@/domain/delivery/application/repositories/receivers-repository";
import { Receiver } from "@/domain/delivery/enterprise/entities/receiver";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { PrismaReceiverMapper } from "../mappers/prisma-receiver-mapper";

@Injectable()
export class PrismaReceiversRepository implements ReceiversRepository {
    constructor(
        private prisma: PrismaService
    ) { }

    async findById(id: string): Promise<Receiver> {
        const receiver = await this.prisma.receiver.findUnique({
            where: { id }
        })

        if (!receiver) {
            return null
        }

        return PrismaReceiverMapper.toDomain(receiver);
    }

    async create(receiver: Receiver): Promise<void> {
        await this.prisma.receiver.create({
            data: PrismaReceiverMapper.toPrisma(receiver)
        })
    }

    async save(receiver: Receiver): Promise<void> {
        await this.prisma.receiver.update({
            where: { id: receiver.id.toString() },
            data: PrismaReceiverMapper.toPrisma(receiver)
        })
    }

    async delete(receiver: Receiver): Promise<void> {
        await this.prisma.receiver.delete({
            where: { id: receiver.id.toString() }
        })
    }
}