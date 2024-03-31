import { Either, left, right } from "@/core/either";
import { ReceiversRepository } from "../../repositories/receivers-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../../repositories/users-repository";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { UserRole } from "@/domain/delivery/enterprise/entities/user";

interface DeleteReceiverUseCaseRequest {
    userId: string
    receiverId: string
}

type DeleteReceiverUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>

@Injectable()
export class DeleteReceiverUseCase {
    constructor(
        private receiversRepository: ReceiversRepository,
        private usersRepository: UsersRepository,
    ) { }

    async execute({ receiverId, userId }: DeleteReceiverUseCaseRequest): Promise<DeleteReceiverUseCaseResponse> {
        const user = await this.usersRepository.findById(userId)
        if (user.role != UserRole.ADMIN) {
            return left(new NotAllowedError())
        }

        const receiver = await this.receiversRepository.findById(receiverId)
        if (!receiver) {
            return left(new ResourceNotFoundError())
        }

        await this.receiversRepository.delete(receiver)

        return right({})
    }

}