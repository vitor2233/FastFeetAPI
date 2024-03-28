import { Either, left, right } from "@/core/either";
import { OrdersRepository } from "../../repositories/orders-repository";
import { Order, OrderStatus } from "@/domain/delivery/enterprise/entities/order";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UsersRepository } from "../../repositories/users-repository";

interface RefoundOrderUseCaseRequest {
    deliverymanId: string
    orderId: string
}

type RefoundOrderUseCaseResponse = Either<ResourceNotFoundError, { order: Order }>

export class RefoundOrderUseCase {
    constructor(
        private ordersRepository: OrdersRepository,
        private usersRepository: UsersRepository,
    ) { }

    async execute({ deliverymanId, orderId }: RefoundOrderUseCaseRequest): Promise<RefoundOrderUseCaseResponse> {
        const order = await this.ordersRepository.findById(orderId)
        const user = await this.usersRepository.findById(deliverymanId)

        if (!order) {
            return left(new ResourceNotFoundError())
        }

        if (!user) {
            return left(new ResourceNotFoundError())
        }

        order.status = OrderStatus.WAITING
        order.deliverymanId = new UniqueEntityID(deliverymanId)
        order.withdrawnDate = null

        await this.ordersRepository.save(order)

        return right({
            order
        })
    }

}