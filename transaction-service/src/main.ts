import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.RMQ,
        options: {
            urls: [process.env.RABBITMQ_HOST],
            queue: process.env.QUEUE,
            queueOptions: {
                durable: false
            },
        }
    });
    app.listen();
}

bootstrap();
