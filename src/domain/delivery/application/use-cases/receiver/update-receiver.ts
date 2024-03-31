import { Either, left, right } from "@/core/either";
import { ReceiversRepository } from "../../repositories/receivers-repository";
import { Receiver } from "@/domain/delivery/enterprise/entities/receiver";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { UsersRepository } from "../../repositories/users-repository";
import { UserRole } from "@/domain/delivery/enterprise/entities/user";

interface UpdateReceiverUseCaseRequest {
    userId: string
    receiverId: string
    name: string
}

type UpdateReceiverUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, { receiver: Receiver }>

@Injectable()
export class UpdateReceiverUseCase {
    constructor(
        private receiversRepository: ReceiversRepository,
        private usersRepository: UsersRepository,
    ) { }

    async execute({ receiverId, userId, name }: UpdateReceiverUseCaseRequest): Promise<UpdateReceiverUseCaseResponse> {
        const user = await this.usersRepository.findById(userId)
        if (user.role != UserRole.ADMIN) {
            return left(new NotAllowedError())
        }

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