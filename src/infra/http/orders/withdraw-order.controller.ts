import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { WithdrawOrderUseCase } from "@/domain/delivery/application/use-cases/order/withdraw-order";
import { BadRequestException, Body, Controller, Param, Patch, UnauthorizedException } from "@nestjs/common";
import { z } from "zod"

const withdrawOrderBodySchema = z.object({
    deliverymanId: z.string().uuid(),
})

export type WithdrawOrderBodySchema = z.infer<typeof withdrawOrderBodySchema>

@Controller('/orders/withdraw/:orderId')
export class WithdrawOrderController {
    constructor(
        private withdrawOrder: WithdrawOrderUseCase
    ) { }

    @Patch()
    async handle(@Body() body: WithdrawOrderBodySchema,
        @Param('orderId') orderId: string,
    ) {
        const { deliverymanId } = body;

        const result = await this.withdrawOrder.execute({ orderId, deliverymanId })

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