import { Either, left, right } from "@/core/either";
import { OrdersRepository } from "../../repositories/orders-repository";
import { Order, OrderStatus } from "@/domain/delivery/enterprise/entities/order";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface CreateOrderUseCaseRequest {
    receiverId: string
    name: string
}

type CreateOrderUseCaseResponse = Either<null, { order: Order }>

export class CreateOrderUseCase {
    constructor(
        private ordersRepository: OrdersRepository,
    ) { }

    async execute({ receiverId, name }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
        const order = Order.create({
            name,
            receiverId: new UniqueEntityID(receiverId),
            status: OrderStatus.WAITING,
        })

        await this.ordersRepository.create(order)

        return right({
            order
        })
    }

}