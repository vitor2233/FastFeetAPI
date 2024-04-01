import { FindManyNearbyParams, OrdersRepository } from "@/domain/delivery/application/repositories/orders-repository";
import { Order } from "@/domain/delivery/enterprise/entities/order";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
    constructor(
        private prisma: PrismaService
    ) { }

    async findById(id: string): Promise<Order | null> {
        throw new Error("Method not implemented.");
    }
    async findManyNearby(params: FindManyNearbyParams): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    async findManyByDeliverymanId(deliverymanId: string): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    async create(order: Order): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async save(order: Order): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async delete(order: Order): Promise<void> {
        throw new Error("Method not implemented.");
    }
}