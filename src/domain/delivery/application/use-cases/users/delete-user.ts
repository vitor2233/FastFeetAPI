import { Either, left, right } from "@/core/either";
import { UsersRepository } from "../../repositories/users-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { UserRole } from "@/domain/delivery/enterprise/entities/user";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

interface DeleteUserUseCaseRequest {
    loggedUserId: string
    userId: string
}

type DeleteUserUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>

@Injectable()
export class DeleteUserUseCase {
    constructor(
        private usersRepository: UsersRepository,
    ) { }

    async execute({ userId, loggedUserId }: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
        const loggedUser = await this.usersRepository.findById(loggedUserId)
        if (loggedUser.role != UserRole.ADMIN) {
            return left(new NotAllowedError())
        }

        const user = await this.usersRepository.findById(userId)
        if (!user) {
            return left(new ResourceNotFoundError())
        }

        await this.usersRepository.delete(user)

        return right({})
    }

}