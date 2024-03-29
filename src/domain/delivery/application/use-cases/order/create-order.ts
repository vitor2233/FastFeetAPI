import { Either, left, right } from "@/core/either";
import { OrdersRepository } from "../../repositories/orders-repository";
import { Order, OrderStatus } from "@/domain/delivery/enterprise/entities/order";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Injectable } from "@nestjs/common";

interface CreateOrderUseCaseRequest {
    receiverId: string
    name: string
    address: string
    latitude: number
    longitude: number
}

type CreateOrderUseCaseResponse = Either<null, { order: Order }>

@Injectable()
export class CreateOrderUseCase {
    constructor(
        private ordersRepository: OrdersRepository,
    ) { }

    async execute({ receiverId, name, address, latitude, longitude }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
        const order = Order.create({
            name,
            address,
            latitude,
            longitude,
            receiverId: new UniqueEntityID(receiverId),
            status: OrderStatus.WAITING,
        })

        await this.ordersRepository.create(order)

        return right({
            order
        })
    }

}