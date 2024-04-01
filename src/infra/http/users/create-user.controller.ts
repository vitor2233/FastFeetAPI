import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { CreateUserUseCase } from "@/domain/delivery/application/use-cases/users/create-user";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { z } from "zod"

const createUserBodySchema = z.object({
    cpf: z.string(),
    name: z.string(),
    role: z.enum(["ADMIN", "DELIVERYMAN"]),
    password: z.string(),
})

export type CreateUserBodySchema = z.infer<typeof createUserBodySchema>

@Controller('/users/create')
export class CreateUserController {
    constructor(
        private createUser: CreateUserUseCase
    ) { }

    @Post()
    async handle(@Body() body: CreateUserBodySchema,
        @CurrentUser() user: UserPayload) {
        const { name, cpf, role, password } = body;
        const userId = user.sub

        const result = await this.createUser.execute({ name, userId, cpf, role, password })

        if (result.isLeft()) {
            const error = result.value
            switch (error.constructor) {
                case NotAllowedError:
                    throw new UnauthorizedException(error.message)
                default:
                    throw new BadRequestException(error.message)
            }
        }
    }
}