import { Either, left, right } from "@/core/either";
import { UsersRepository } from "../../repositories/users-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";

interface DeleteUserUseCaseRequest {
    userId: string
}

type DeleteUserUseCaseResponse = Either<ResourceNotFoundError, {}>

@Injectable()
export class DeleteUserUseCase {
    constructor(
        private usersRepository: UsersRepository,
    ) { }

    async execute({ userId }: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
        const user = await this.usersRepository.findById(userId)
        if (!user) {
            return left(new ResourceNotFoundError())
        }

        await this.usersRepository.delete(user)

        return right({})
    }

}