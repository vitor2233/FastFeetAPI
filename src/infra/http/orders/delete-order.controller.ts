import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { DeleteOrderUseCase } from "@/domain/delivery/application/use-cases/order/delete-order";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Body, Controller, Delete, Param, Post, UnauthorizedException } from "@nestjs/common";


@Controller('/orders/delete/:orderId')
export class DeleteOrderController {
    constructor(
        private deleteOrder: DeleteOrderUseCase
    ) { }

    @Delete()
    async handle(@Param('orderId') orderId: string,
        @CurrentUser() user: UserPayload) {
        const userId = user.sub

        const result = await this.deleteOrder.execute({ orderId, userId })

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