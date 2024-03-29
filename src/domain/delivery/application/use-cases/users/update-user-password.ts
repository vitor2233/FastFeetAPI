import { Either, left, right } from "@/core/either";
import { UsersRepository } from "../../repositories/users-repository";
import { UserAlreadyExistsError } from "../errors/user-already-exists-error";
import { User, UserRole } from "@/domain/delivery/enterprise/entities/user";
import { HashGenerator } from "@/domain/delivery/cryptography/hash-generator";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Encrypter } from "@/domain/delivery/cryptography/encrypter";
import { HashComparer } from "@/domain/delivery/cryptography/hash-comparer";
import { WrongCredentialsError } from "../errors/wrong-credentials-error";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { Injectable } from "@nestjs/common";

interface UpdateUserPasswordUseCaseRequest {
    idUser: string
    oldPassword: string
    newPassword: string
}

type UpdateUserPasswordUseCaseResponse = Either<ResourceNotFoundError | WrongCredentialsError | NotAllowedError, { user: User }>

@Injectable()
export class UpdateUserPasswordUseCase {
    constructor(
        private usersRepository: UsersRepository,
        private hashGenerator: HashGenerator,
        private hashComparer: HashComparer,
    ) { }

    async execute({ idUser, oldPassword, newPassword }: UpdateUserPasswordUseCaseRequest): Promise<UpdateUserPasswordUseCaseResponse> {
        const user = await this.usersRepository.findById(idUser)
        if (!user) {
            return left(new ResourceNotFoundError())
        }

        const isPasswordValid = await this.hashComparer.compare(oldPassword, user.password)

        if (!isPasswordValid) {
            return left(new WrongCredentialsError())
        }

        const hashedPassword = await this.hashGenerator.hash(newPassword)
        console.log(hashedPassword);

        user.password = hashedPassword

        await this.usersRepository.save(user)

        return right({
            user
        })
    }

}