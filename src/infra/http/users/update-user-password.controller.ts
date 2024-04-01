import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { CreateUserUseCase } from "@/domain/delivery/application/use-cases/users/create-user";
import { UpdateUserUseCase } from "@/domain/delivery/application/use-cases/users/update-user";
import { UpdateUserPasswordUseCase } from "@/domain/delivery/application/use-cases/users/update-user-password";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Body, Controller, Param, Post, Put, UnauthorizedException } from "@nestjs/common";
import { z } from "zod"

const updateUserBodySchema = z.object({
    oldPassword: z.string(),
    newPassword: z.string(),
})

export type CreateUserBodySchema = z.infer<typeof updateUserBodySchema>

@Controller('/users/update-password/:userId')
export class UpdateUserPasswordController {
    constructor(
        private updateUserPassword: UpdateUserPasswordUseCase
    ) { }

    @Put()
    async handle(
        @Body() body: CreateUserBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('userId') userId: string,
    ) {

        const { oldPassword, newPassword } = body;
        const loggedUserId = user.sub

        const result = await this.updateUserPassword.execute({ loggedUserId, userId, oldPassword, newPassword })

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