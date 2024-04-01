import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { CreateUserUseCase } from "@/domain/delivery/application/use-cases/users/create-user";
import { UpdateUserUseCase } from "@/domain/delivery/application/use-cases/users/update-user";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Body, Controller, Param, Post, Put, UnauthorizedException } from "@nestjs/common";
import { z } from "zod"

const updateUserBodySchema = z.object({
    cpf: z.string(),
    name: z.string(),
})

export type CreateUserBodySchema = z.infer<typeof updateUserBodySchema>

@Controller('/users/update/:userId')
export class UpdateUserController {
    constructor(
        private updateUser: UpdateUserUseCase
    ) { }

    @Put()
    async handle(
        @Body() body: CreateUserBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('userId') userId: string,
    ) {

        const { name, cpf } = body;
        const loggedUserId = user.sub

        const result = await this.updateUser.execute({ cpf, name, loggedUserId, userId })

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