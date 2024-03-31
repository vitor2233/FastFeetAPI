import { Either, left, right } from "@/core/either";
import { OrdersRepository } from "../../repositories/orders-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { OrderStatus } from "@/domain/delivery/enterprise/entities/order";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../../repositories/users-repository";
import { UserRole } from "@/domain/delivery/enterprise/entities/user";

interface DeleteOrderUseCaseRequest {
    userId: string
    orderId: string
}

type DeleteOrderUseCaseResponse = Either<ResourceNotFoundError, {}>

@Injectable()
export class DeleteOrderUseCase {
    constructor(
        private ordersRepository: OrdersRepository,
        private usersRepository: UsersRepository,
    ) { }

    async execute({ orderId, userId }: DeleteOrderUseCaseRequest): Promise<DeleteOrderUseCaseResponse> {
        const user = await this.usersRepository.findById(userId)
        if (user.role != UserRole.ADMIN) {
            return left(new NotAllowedError())
        }

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