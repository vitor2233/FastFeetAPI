import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { DeleteUserUseCase } from "@/domain/delivery/application/use-cases/users/delete-user";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Body, Controller, Delete, Param, Post, UnauthorizedException } from "@nestjs/common";


@Controller('/users/delete/:userId')
export class DeleteUserController {
    constructor(
        private deleteUser: DeleteUserUseCase
    ) { }

    @Delete()
    async handle(@Param('userId') userId: string,
        @CurrentUser() user: UserPayload) {
        const loggedUserId = user.sub

        const result = await this.deleteUser.execute({ userId, loggedUserId })

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