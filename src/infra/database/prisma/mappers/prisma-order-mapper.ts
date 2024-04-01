import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Order, OrderStatus } from "@/domain/delivery/enterprise/entities/order";
import { Prisma, Order as PrismaOrder, OrderStatus as PrismaOrderStatus } from "@prisma/client";

export class PrismaOrderMapper {
    static toDomain(raw: PrismaOrder): Order {
        const orderStatusMap: Record<PrismaOrderStatus, OrderStatus> = {
            [PrismaOrderStatus.DELIVERED]: OrderStatus.DELIVERED,
            [PrismaOrderStatus.WAITING]: OrderStatus.WAITING,
            [PrismaOrderStatus.WITHDRAWN]: OrderStatus.WITHDRAWN
        };

        const orderStatus: OrderStatus = orderStatusMap[raw.status];

        return Order.create({
            address: raw.address,
            status: orderStatus,
            latitude: raw.latitude.toNumber(),
            longitude: raw.longitude.toNumber(),
            deliveryDate: raw.deliveryDate,
            deliverymanId: new UniqueEntityID(raw.deliverymanId),
            withdrawnDate: raw.withdrawnDate,
            name: raw.name,
            receiverId: new UniqueEntityID(raw.receiverId),
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        }, new UniqueEntityID(raw.id))
    }

    static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
        const orderStatusMap: Record<OrderStatus, PrismaOrderStatus> = {
            [OrderStatus.DELIVERED]: PrismaOrderStatus.DELIVERED,
            [OrderStatus.WAITING]: PrismaOrderStatus.WAITING,
            [OrderStatus.WITHDRAWN]: PrismaOrderStatus.WITHDRAWN
        };

        const orderStatus: PrismaOrderStatus = orderStatusMap[order.status];

        return {
            id: order.id.toString(),
            address: order.address,
            status: orderStatus,
            latitude: order.latitude,
            longitude: order.longitude,
            deliveryDate: order.deliveryDate,
            deliverymanId: order.deliverymanId.toString(),
            withdrawnDate: order.withdrawnDate,
            name: order.name,
            receiverId: order.receiverId.toString(),
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        }
    }
}
