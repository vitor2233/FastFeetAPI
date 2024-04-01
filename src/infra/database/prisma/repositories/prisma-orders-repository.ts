import { FindManyNearbyParams, OrdersRepository } from "@/domain/delivery/application/repositories/orders-repository";
import { Order } from "@/domain/delivery/enterprise/entities/order";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { PrismaOrderMapper } from "../mappers/prisma-order-mapper";
import { Order as PrismaOrder } from "@prisma/client";

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
    constructor(
        private prisma: PrismaService
    ) { }

    async findById(id: string): Promise<Order | null> {
        const order = await this.prisma.order.findUnique({
            where: {
                id
            }
        })
        if (!order) {
            return null
        }

        return PrismaOrderMapper.toDomain(order);
    }

    async findManyNearby({ deliverymanId, latitude, longitude }: FindManyNearbyParams): Promise<Order[]> {
        const orders = await this.prisma.$queryRaw<PrismaOrder[]>`
            SELECT * FROM gyms
            WHERE deliverymanId = ${deliverymanId} AND ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
        `

        return orders.map(order => {
            return PrismaOrderMapper.toDomain(order);
        })
    }

    async findManyByDeliverymanId(deliverymanId: string): Promise<Order[]> {
        const orders = await this.prisma.order.findMany({
            where: {
                deliverymanId
            }
        })

        return orders.map(order => {
            return PrismaOrderMapper.toDomain(order);
        })
    }

    async create(order: Order): Promise<void> {
        await this.prisma.order.create({
            data: PrismaOrderMapper.toPrisma(order)
        })
    }

    async save(order: Order): Promise<void> {
        await this.prisma.order.update({
            where: { id: order.id.toString() },
            data: PrismaOrderMapper.toPrisma(order)
        })
    }

    async delete(order: Order): Promise<void> {
        await this.prisma.order.delete({
            where: {
                id: order.id.toString()
            }
        })
    }
}