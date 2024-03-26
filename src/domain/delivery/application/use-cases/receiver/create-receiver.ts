import { Either, left, right } from "@/core/either";
import { ReceiversRepository } from "../../repositories/receivers-repository";
import { Receiver } from "@/domain/delivery/enterprise/entities/receiver";

interface CreateReceiverUseCaseRequest {
    name: string
    address: string
    latitude: number
    longitude: number
}

type CreateReceiverUseCaseResponse = Either<null, { receiver: Receiver }>

export class CreateReceiverUseCase {
    constructor(
        private receiversRepository: ReceiversRepository,
    ) { }

    async execute({ name, address, latitude, longitude }: CreateReceiverUseCaseRequest): Promise<CreateReceiverUseCaseResponse> {
        const receiver = Receiver.create({
            name,
            address,
            latitude,
            longitude
        })

        await this.receiversRepository.create(receiver)

        return right({
            receiver
        })
    }

}