import { Either, left, right } from "@/core/either";
import { OrdersRepository } from "../../repositories/orders-repository";
import { Order, OrderStatus } from "@/domain/delivery/enterprise/entities/order";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UsersRepository } from "../../repositories/users-repository";
import { UserRole } from "@/domain/delivery/enterprise/entities/user";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

interface FetchDeliverymanOrdersUseCaseRequest {
    deliverymanId: string
}

type FetchDeliverymanOrdersUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, { orders: Order[] }>

export class FetchDeliverymanOrdersUseCase {
    constructor(
        private ordersRepository: OrdersRepository,
        private usersRepository: UsersRepository,
    ) { }

    async execute({ deliverymanId }: FetchDeliverymanOrdersUseCaseRequest): Promise<FetchDeliverymanOrdersUseCaseResponse> {
        const user = await this.usersRepository.findById(deliverymanId)

        if (!user) {
            return left(new ResourceNotFoundError())
        }

        if (user.role != UserRole.DELIVERYMAN) {
            return left(new NotAllowedError())
        }

        const orders = await this.ordersRepository.findManyByDeliverymanId(user.id.toString())

        return right({
            orders
        })
    }

}