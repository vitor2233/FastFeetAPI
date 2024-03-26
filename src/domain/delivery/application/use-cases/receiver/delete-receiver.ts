import { Either, left, right } from "@/core/either";
import { ReceiversRepository } from "../../repositories/receivers-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

interface DeleteReceiverUseCaseRequest {
    receiverId: string
}

type DeleteReceiverUseCaseResponse = Either<ResourceNotFoundError, {}>

export class DeleteReceiverUseCase {
    constructor(
        private receiversRepository: ReceiversRepository,
    ) { }

    async execute({ receiverId }: DeleteReceiverUseCaseRequest): Promise<DeleteReceiverUseCaseResponse> {
        const receiver = await this.receiversRepository.findById(receiverId)
        if (!receiver) {
            return left(new ResourceNotFoundError())
        }

        await this.receiversRepository.delete(receiver)

        return right({})
    }

}