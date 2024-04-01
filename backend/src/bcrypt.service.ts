import { Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";

@Injectable()
export class BcryptService {
  async hash(content: string) {
    const salt = await bcrypt.genSalt();
    const result = await bcrypt.hash(content, salt);
    return result;
  }

  async compare(content: string, hash: string) {
    const result = await bcrypt.compare(content, hash);
    return result;
  }
}
