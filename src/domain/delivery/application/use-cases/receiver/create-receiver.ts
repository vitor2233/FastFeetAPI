import { Either, left, right } from "@/core/either";
import { ReceiversRepository } from "../../repositories/receivers-repository";
import { Receiver } from "@/domain/delivery/enterprise/entities/receiver";
import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../../repositories/users-repository";
import { UserRole } from "@/domain/delivery/enterprise/entities/user";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

interface CreateReceiverUseCaseRequest {
    userId: string
    name: string
}

type CreateReceiverUseCaseResponse = Either<NotAllowedError, { receiver: Receiver }>

@Injectable()
export class CreateReceiverUseCase {
    constructor(
        private receiversRepository: ReceiversRepository,
        private usersRepository: UsersRepository,
    ) { }

    async execute({ name, userId }: CreateReceiverUseCaseRequest): Promise<CreateReceiverUseCaseResponse> {
        const user = await this.usersRepository.findById(userId)
        if (user.role != UserRole.ADMIN) {
            return left(new NotAllowedError())
        }

        const receiver = Receiver.create({
            name,
        })

        await this.receiversRepository.create(receiver)

        return right({
            receiver
        })
    }

}