import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {ConfigService} from "@nestjs/config";
import {json, urlencoded} from "express";


async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Swagger
    const nodeEnv = configService.get('NODE_ENV') || 'development';

    if ('development' === nodeEnv) {
        const config = new DocumentBuilder()
            .setTitle('API Service')
            .setDescription('The swagger for api-service banking')
            .setVersion('1.0')
            .addBearerAuth(
                {type: 'http', scheme: 'bearer', bearerFormat: 'JWT'},
                'authentication'
            )
            .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api', app, document);
    }

    // CORS, payload limit
    app.use(json({limit: '10mb'}));
    app.use(urlencoded({extended: true, limit: '10mb'}));
    const options = {
        "origin": "*",
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "preflightContinue": false,
        "optionsSuccessStatus": 204,
        "credentials":true
    };
    app.enableCors(options);
    const port = process.env.PORT || 3001;
    app.listen(port)
}

bootstrap();
