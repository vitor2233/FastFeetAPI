import { Controller, Get } from "@nestjs/common";
import { CurrentUser } from "../auth/current-user-decorator";
import { UserPayload } from "../auth/jwt.strategy";

@Controller('/orders/')
export class OrdersController {

    @Get('deliveryman-orders')
    async fetchDeliverymanOrders(
        @CurrentUser() user: UserPayload,
    ) {
        const userId = user.sub
        console.log(userId);


    }
}