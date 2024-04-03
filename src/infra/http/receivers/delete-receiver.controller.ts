import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { DeleteReceiverUseCase } from "@/domain/delivery/application/use-cases/receiver/delete-receiver";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Body, Controller, Delete, Param, Post, UnauthorizedException } from "@nestjs/common";


@Controller('/receivers/delete/:receiverId')
export class DeleteReceiverController {
    constructor(
        private deleteReceiver: DeleteReceiverUseCase
    ) { }

    @Delete()
    async handle(@Param('receiverId') receiverId: string,
        @CurrentUser() user: UserPayload) {
        const userId = user.sub

        const result = await this.deleteReceiver.execute({ receiverId, userId })

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