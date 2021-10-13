import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config";
import { BankingModule } from './banking/banking.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BankingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
