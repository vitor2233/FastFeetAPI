import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { RefoundOrderUseCase } from "@/domain/delivery/application/use-cases/order/refound-order";
import { BadRequestException, Body, Controller, Param, Patch, UnauthorizedException } from "@nestjs/common";
import { z } from "zod"

const refoundOrderBodySchema = z.object({
    deliverymanId: z.string().uuid(),
})

export type RefoundOrderBodySchema = z.infer<typeof refoundOrderBodySchema>

@Controller('/orders/refound/:orderId')
export class RefoundOrderController {
    constructor(
        private refoundOrder: RefoundOrderUseCase
    ) { }

    @Patch()
    async handle(@Body() body: RefoundOrderBodySchema,
        @Param('orderId') orderId: string,
    ) {
        const { deliverymanId } = body;

        const result = await this.refoundOrder.execute({ orderId, deliverymanId })

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