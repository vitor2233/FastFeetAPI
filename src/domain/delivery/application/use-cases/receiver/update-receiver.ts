import { Either, left, right } from "@/core/either";
import { ReceiversRepository } from "../../repositories/receivers-repository";
import { Receiver } from "@/domain/delivery/enterprise/entities/receiver";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";

interface UpdateReceiverUseCaseRequest {
    receiverId: string
    name: string
}

type UpdateReceiverUseCaseResponse = Either<ResourceNotFoundError, { receiver: Receiver }>

@Injectable()
export class UpdateReceiverUseCase {
    constructor(
        private receiversRepository: ReceiversRepository,
    ) { }

    async execute({ receiverId, name }: UpdateReceiverUseCaseRequest): Promise<UpdateReceiverUseCaseResponse> {
        const receiver = await this.receiversRepository.findById(receiverId)
        if (!receiver) {
            return left(new ResourceNotFoundError())
        }

        receiver.name = name

        await this.receiversRepository.save(receiver)

        return right({
            receiver
        })
    }

}