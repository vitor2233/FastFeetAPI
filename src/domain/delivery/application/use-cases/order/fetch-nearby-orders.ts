import { Either, left, right } from "@/core/either";
import { OrdersRepository } from "../../repositories/orders-repository";
import { Order, OrderStatus } from "@/domain/delivery/enterprise/entities/order";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UsersRepository } from "../../repositories/users-repository";
import { UserRole } from "@/domain/delivery/enterprise/entities/user";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

interface FetchNearbyOrdersUseCaseRequest {
    deliverymanId: string
    latitude: number
    longitude: number
}

type FetchNearbyOrdersUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, { orders: Order[] }>

export class FetchNearbyOrdersUseCase {
    constructor(
        private ordersRepository: OrdersRepository,
        private usersRepository: UsersRepository,
    ) { }

    async execute({ deliverymanId, latitude, longitude }: FetchNearbyOrdersUseCaseRequest): Promise<FetchNearbyOrdersUseCaseResponse> {
        const user = await this.usersRepository.findById(deliverymanId)

        if (!user) {
            return left(new ResourceNotFoundError())
        }

        if (user.role != UserRole.DELIVERYMAN) {
            return left(new NotAllowedError())
        }

        const orders = await this.ordersRepository.findManyNearby({ deliverymanId: user.id.toString(), latitude, longitude })

        return right({
            orders
        })
    }

}