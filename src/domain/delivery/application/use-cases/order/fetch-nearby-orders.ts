import { Either, left, right } from "@/core/either";
import { OrdersRepository } from "../../repositories/orders-repository";
import { Order, OrderStatus } from "@/domain/delivery/enterprise/entities/order";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UsersRepository } from "../../repositories/users-repository";

interface FetchNearbyOrdersUseCaseRequest {
    deliverymanId: string
    latitude: number
    longitude: number
}

type FetchNearbyOrdersUseCaseResponse = Either<ResourceNotFoundError, { orders: Order[] }>

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

        const orders = await this.ordersRepository.findManyNearby({ latitude, longitude })
        console.log(orders);


        return right({
            orders
        })
    }

}