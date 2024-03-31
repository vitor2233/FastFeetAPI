import { Either, left, right } from "@/core/either";
import { UsersRepository } from "../../repositories/users-repository";
import { UserAlreadyExistsError } from "../errors/user-already-exists-error";
import { User, UserRole } from "@/domain/delivery/enterprise/entities/user";
import { HashGenerator } from "@/domain/delivery/cryptography/hash-generator";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

interface UpdateUserUseCaseRequest {
    loggedUserId: string
    userId: string
    cpf: string
    name: string
}

type UpdateUserUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, { user: User }>

@Injectable()
export class UpdateUserUseCase {
    constructor(
        private usersRepository: UsersRepository,
    ) { }

    async execute({ userId, loggedUserId, cpf, name }: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
        const loggedUser = await this.usersRepository.findById(loggedUserId)
        if (loggedUser.role != UserRole.ADMIN) {
            return left(new NotAllowedError())
        }

        const user = await this.usersRepository.findById(userId)
        if (!user) {
            return left(new ResourceNotFoundError())
        }

        user.cpf = cpf
        user.name = name

        await this.usersRepository.save(user)

        return right({
            user
        })
    }

}