import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";

@ApiTags('Default')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Default url'
  })
  @ApiOkResponse({type: String})
  @Get()
  getHello(): string {
    return this.appService.default();
  }
}
