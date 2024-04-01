import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Receiver } from "@/domain/delivery/enterprise/entities/receiver";
import { Prisma, Receiver as PrismaReceiver } from "@prisma/client";

export class PrismaReceiverMapper {
    static toDomain(raw: PrismaReceiver): Receiver {
        return Receiver.create({
            name: raw.name,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        }, new UniqueEntityID(raw.id))
    }

    static toPrisma(receiver: Receiver): Prisma.ReceiverUncheckedCreateInput {
        return {
            id: receiver.id.toString(),
            name: receiver.name,
            createdAt: receiver.createdAt,
            updatedAt: receiver.updatedAt
        }
    }
}
