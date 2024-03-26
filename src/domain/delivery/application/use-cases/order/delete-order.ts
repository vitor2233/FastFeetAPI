import { Either, left, right } from "@/core/either";
import { OrdersRepository } from "../../repositories/orders-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { OrderStatus } from "@/domain/delivery/enterprise/entities/order";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

interface DeleteOrderUseCaseRequest {
    orderId: string
}

type DeleteOrderUseCaseResponse = Either<ResourceNotFoundError, {}>

export class DeleteOrderUseCase {
    constructor(
        private ordersRepository: OrdersRepository,
    ) { }

    async execute({ orderId }: DeleteOrderUseCaseRequest): Promise<DeleteOrderUseCaseResponse> {
        const order = await this.ordersRepository.findById(orderId)

        if (!order) {
            return left(new ResourceNotFoundError())
        }

        if (order.status != OrderStatus.DELIVERED) {
            return left(new NotAllowedError())
        }

        await this.ordersRepository.delete(order)

        return right({})
    }

}