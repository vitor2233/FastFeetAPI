import { AuthenticateUserUseCase } from "@/domain/delivery/application/use-cases/authenticate-user";
import { WrongCredentialsError } from "@/domain/delivery/application/use-cases/errors/wrong-credentials-error";
import { Public } from "@/infra/auth/public";
import { BadRequestException, Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { z } from "zod";

const authenticateUserBodySchema = z.object({
    cpf: z.string(),
    password: z.string(),
})
export type AuthenticateUserBodySchema = z.infer<typeof authenticateUserBodySchema>

@Controller('/users/authenticate')
@Public()
export class AuthenticateUserController {
    constructor(
        private authenticateUser: AuthenticateUserUseCase
    ) { }

    @Post()
    async handle(@Body() body: AuthenticateUserBodySchema) {
        const { cpf, password } = body;

        const result = await this.authenticateUser.execute({ cpf, password })

        if (result.isLeft()) {
            const error = result.value
            switch (error.constructor) {
                case WrongCredentialsError:
                    throw new UnauthorizedException(error.message)
                default:
                    throw new BadRequestException(error.message)
            }
        }

        const { accessToken } = result.value

        return {
            accessToken: accessToken
        }

    }
}