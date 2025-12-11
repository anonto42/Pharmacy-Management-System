import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { CreateUserDto, MicroservicePattern } from '@pharmacy-management-system/common';
import { UserService } from './user.service';

@Injectable()
export class UserConsumer {
    private readonly logger = new Logger(UserConsumer.name);
    private client: ClientProxy;

    constructor(private userService: UserService) {
        this.client = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
                queue: 'user_queue',
                queueOptions: { durable: true },
            },
        });
    }

    @OnEvent(MicroservicePattern.USER_CREATE)
    async handleUserCreate(data: CreateUserDto) {
        this.logger.log(`Received user creation event: ${JSON.stringify(data)}`);

        try {
            const user = await this.userService.create(data);
            this.logger.log(`User created: ${user.id}`);
        } catch (error) {
            this.logger.error(`Failed to create user: ${error.message}`);
        }
    }
}