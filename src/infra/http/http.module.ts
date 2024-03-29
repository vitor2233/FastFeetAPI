import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { UsersController } from './user.controller';
import { ReceiversController } from './receiver.controller';
import { CreateOrderUseCase } from '@/domain/delivery/application/use-cases/order/create-order';
import { DeleteOrderUseCase } from '@/domain/delivery/application/use-cases/order/delete-order';
import { FetchDeliverymanOrdersUseCase } from '@/domain/delivery/application/use-cases/order/fetch-deliveryman-orders';
import { FetchNearbyOrdersUseCase } from '@/domain/delivery/application/use-cases/order/fetch-nearby-orders';
import { RefoundOrderUseCase } from '@/domain/delivery/application/use-cases/order/refound-order';
import { UpdateOrderUseCase } from '@/domain/delivery/application/use-cases/order/update-order';
import { WithdrawOrderUseCase } from '@/domain/delivery/application/use-cases/order/withdraw-order';
import { CreateReceiverUseCase } from '@/domain/delivery/application/use-cases/receiver/create-receiver';
import { DeleteReceiverUseCase } from '@/domain/delivery/application/use-cases/receiver/delete-receiver';
import { UpdateReceiverUseCase } from '@/domain/delivery/application/use-cases/receiver/update-receiver';
import { AuthenticateUserUseCase } from '@/domain/delivery/application/use-cases/authenticate-user';
import { CreateUserUseCase } from '@/domain/delivery/application/use-cases/users/create-user';
import { DeleteUserUseCase } from '@/domain/delivery/application/use-cases/users/delete-user';
import { UpdateUserUseCase } from '@/domain/delivery/application/use-cases/users/update-user';
import { UpdateUserPasswordUseCase } from '@/domain/delivery/application/use-cases/users/update-user-password';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [OrdersController, UsersController, ReceiversController],
  providers: [
    //Orders
    CreateOrderUseCase,
    DeleteOrderUseCase,
    FetchDeliverymanOrdersUseCase,
    FetchNearbyOrdersUseCase,
    RefoundOrderUseCase,
    UpdateOrderUseCase,
    WithdrawOrderUseCase,
    //Receivers
    CreateReceiverUseCase,
    DeleteReceiverUseCase,
    UpdateReceiverUseCase,
    //Users
    AuthenticateUserUseCase,
    CreateUserUseCase,
    DeleteUserUseCase,
    UpdateUserUseCase,
    UpdateUserPasswordUseCase,
  ],
})
export class HttpModule { }
