import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getMeta() {
    return {
      name: "笨钟大学堂",
      version: "1.0.0",
    };
  }
}
